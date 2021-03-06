import React, { Component } from "react";
// nodejs library that concatenates classes
import classnames from "classnames";
import moment from "moment";
// react plugin used to create datetimepicker
import ReactDatetime from "react-datetime";
// reactstrap components
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Modal
} from "reactstrap";

import withActor from "../../Query/singleActor";
import withUpdateActor from "../../Query/updateActor";
import withCreateActor from "../../Query/createActor";
import withallMovie from "../../Query/allMovie";
import createRelation from "../../Query/createRelation";
import deleteRelation from "../../Query/deleteRelation";

class ActorModal extends Component {
  initialState = {
    id: this.props.Data ? this.props.Data.id : 0,
    name: this.props.Data ? this.props.Data.name : "",
    biodata: this.props.Data ? this.props.Data.biodata : "",
    sex: this.props.Data ? this.props.Data.sex : "Male",
    dob: this.props.Data
      ? this.props.Data.dob
      : moment(new Date()).format("MM/DD/YYYY")
  };
  state = this.initialState;

  handleChange = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleRadioChange = event => {
    this.setState({
      sex: event.target.name
    });
  };

  handleDateChange = data => {
    this.setState({
      dob:
        data && data._isValid && data.toDate()
          ? moment(data.toDate())
          : moment(new Date()).format("MM/DD/YYYY"),
      errorText:
        data && !data._isValid ? "Invalid DOB (Default date : Current)" : ""
    });
  };

  componentDidUpdate(previousProps, previousState) {
    if (
      this.props.Data &&
      (!previousProps.Data || previousProps.Data !== this.props.Data)
    ) {
      this.setState({
        id: this.props.Data ? this.props.Data.id : 0,
        name: this.props.Data ? this.props.Data.name : "",
        biodata: this.props.Data ? this.props.Data.biodata : "",
        dob: this.props.Data
          ? moment(new Date(this.props.Data.dob)).format("MM/DD/YYYY")
          : moment(new Date()).format("MM/DD/YYYY"),
        errorText: ""
      });
      var allMovieFiltered = [];
      if (this.props.movieData && this.props.movieData.allMovies) {
        allMovieFiltered = this.props.movieData.allMovies.map(movie => {
          if (
            this.props.Data.movie.find(selected => selected.id === movie.id)
          ) {
            return {
              ...movie,
              status: true
            };
          }
          return {
            ...movie,
            status: false
          };
        });
      }
      this.setState({
        movies: allMovieFiltered
      });
    }
  }

  async handleData() {
    try {
      var addMovie = []
      this.state.movies.map(oneMovie => {
        if(oneMovie.status) {
         addMovie.push(Number(oneMovie.id)) 
        }
        return null
      })
      if (this.state.id !== 0) {
        await this.props.update({
          variables: {
            id: Number(this.state.id),
            name: this.state.name,
            dob: this.state.dob,
            biodata: this.state.biodata,
            sex: this.state.sex
          }
        });
      } else {
        await this.props.create({
          variables: {
            name: this.state.name,
            dob: this.state.dob,
            biodata: this.state.biodata,
            sex: this.state.sex,
            addmovie: addMovie
          }
        });
        
      }
      await this.props.refetch();

      this.props.onClose({
        modal: this.props.modal_name,
        data_id: this.props.data_id
      });
    } catch (e) {
      this.setState({
        errorText: e.message
      });
    }
  }

  async handleRelation(movie, i) {
    try {
      if (this.state.id !== 0) {
        if (this.state.movies[i].status) {
          await this.props.deleteRelation({
            variables: {
              actor_id: this.state.id,
              movie_id: movie
            }
          });
        } else {
          await this.props.createRelation({
            variables: {
              actor_id: this.state.id,
              movie_id: movie
            }
          });
        }
        const updatedMovies = [...this.state.movies];

        updatedMovies[i].status = !updatedMovies[i].status;
        this.setState({
          movies: updatedMovies
        });
        await this.props.refetch();
      } else {
        const updatedMovies = [...this.state.movies];

        updatedMovies[i].status = !updatedMovies[i].status;
        this.setState({
          movies: updatedMovies
        });
      }
    } catch (e) {
      this.setState({
        errorText: e.message
      });
    }
  }

  render() {
    return (
      <Modal
        className="modal-dialogn-centered"
        size="sm"
        isOpen={this.props.isOpen}
        toggle={() =>
          this.props.onClose({
            modal: this.props.modal_name,
            data_id: this.props.data_id
          })
        }
      >
        <div className="modal-body p-0">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-8 py-lg-8">
              <div className="text-center text-muted mb-4">
                <b>{this.props.Text.header_text}</b>
                <br />
                <b className="text-danger">{this.state.errorText}</b>
              </div>
              <Form role="form">
                <FormGroup
                  className={classnames("mt-5", {
                    focused: this.state.nameFocused
                  })}
                >
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-user-run" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Name"
                      type="text"
                      name="name"
                      onFocus={e => this.setState({ nameFocused: true })}
                      onBlur={e => this.setState({ nameFocused: false })}
                      value={this.state.name}
                      onChange={this.handleChange}
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup className="focused">
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-calendar-grid-58" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <ReactDatetime
                      inputProps={{
                        placeholder: "DOB"
                      }}
                      timeFormat={false}
                      dateFormat="MM/DD/YYYY"
                      value={this.state.dob}
                      onChange={data => this.handleDateChange(data)}
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup className="mb-3 ml-3">
                  {/* Radio buttons */}
                  <InputGroup>
                    <div className="mr-5">
                      <small className="text-uppercase font-weight-bold">
                        Sex
                      </small>
                    </div>
                    <div className="custom-control custom-radio mr-3">
                      <input
                        className="custom-control-input"
                        id="male"
                        name="Male"
                        type="radio"
                        checked={this.state.sex === "Male" ? true : false}
                        onChange={data => this.handleRadioChange(data)}
                      />
                      <label className="custom-control-label" htmlFor="male">
                        <span>Male</span>
                      </label>
                    </div>
                    <div className="custom-control custom-radio mr-3">
                      <input
                        className="custom-control-input"
                        id="female"
                        name="Female"
                        checked={this.state.sex === "Female" ? true : false}
                        type="radio"
                        onChange={data => this.handleRadioChange(data)}
                      />
                      <label className="custom-control-label" htmlFor="female">
                        <span>Female</span>
                      </label>
                    </div>
                  </InputGroup>
                </FormGroup>

                <FormGroup className="mb-4">
                  <input
                    className="custom-control-input"
                    defaultChecked
                    id="customRadio6"
                    name="custom-radio-2"
                    type="radio"
                  />

                  <Input
                    className="form-control-alternative"
                    cols="80"
                    name="biodata"
                    placeholder="Biodata..."
                    rows="4"
                    type="textarea"
                    onChange={this.handleChange}
                    value={this.state.biodata}
                  />
                </FormGroup>

                <div className="text-center text-muted mt-2 mb-2">
                  <b>{this.props.Text.relation_text}</b>
                </div>
                <FormGroup className="mb-2">
                  {this.state.movies && this.state.movies.length ?
                    this.state.movies.map((movie, i) => (
                      <div
                        key={movie.id}
                        className="custom-control custom-checkbox mb-3 mr-2"
                      >
                        <input
                          name={"checkBox" + movie.id}
                          id={"check" + movie.id}
                          className="custom-control-input"
                          type="checkbox"
                          checked={movie.status}
                          onChange={e => this.handleRelation(movie.id, i)}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor={"check" + movie.id}
                        >
                          <span>{movie.name}</span>
                        </label>
                      </div>
                    )): <div className="text-center ">No movies found !</div>}
                </FormGroup>

                <Button
                  block
                  className="btn-round"
                  color="default"
                  size="lg"
                  type="button"
                  onClick={() => this.handleData()}
                >
                  {this.props.Text.btn_text}
                </Button>
              </Form>
            </CardBody>
          </Card>
        </div>
      </Modal>
    );
  }
}

export default createRelation(
  deleteRelation(
    withallMovie(withCreateActor(withUpdateActor(withActor(ActorModal))))
  )
);
