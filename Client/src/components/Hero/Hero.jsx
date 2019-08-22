import React, {Component} from "react";

// reactstrap components
import {
  Container,
  Row,
  Col,
} from "reactstrap";

class Hero extends Component {

  movierouteChange() {
    let path = `newPath`;
    this.props.history.push('/movies');
  }

  render() {
    return (
      <>
        <div className="position-relative">
          {/* shape Hero */}
          <section className="section section-lg section-shaped pb-250">
            <div className="shape shape-style-1 shape-default">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <Container className="py-lg-md d-flex">
              <div className="col px-0">
                <Row>
                  <Col lg="6">
                    <h1 className="display-3 text-white">
                      Movie Store{" "}
                      <span>The world's most popular and source for movie</span>
                    </h1>
                    <p className="lead text-white">
                      IMDb is an online database of information related to
                      films, television programs, home videos, video games, and
                      streaming content online – including cast, production crew
                      and personal biographies, plot summaries, trivia, fan and
                      critical reviews, and ratings.
                    </p>
                  </Col>
                </Row>
              </div>
            </Container>
            {/* SVG separator */}
            <div className="separator separator-bottom separator-skew">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
              >
                <polygon
                  className="fill-white"
                  points="2560 0 2560 100 0 100"
                />
              </svg>
            </div>
          </section>
          {/* 1st Hero Variation */}
        </div>
      </>
    );
  }
}

export default Hero;
