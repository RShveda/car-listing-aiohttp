import React from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { Redirect, withRouter } from "react-router-dom";


class NewCarPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brand: "",
      model: "",
      vin: "",
      color: "",
      year: "",
      redirectToReferrer: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  async handleSubmit(event) {
    event.preventDefault()
    try {
        var data = this.state;
        delete data.redirectToReferrer;
        await fetch('http://localhost:8080/cars', {
          method: 'POST',
          body: JSON.stringify(this.state),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      ).then(function(response) {
        return response.text()
      }).then(function(data) {
          alert(data)
      });
    } catch (e) {
      alert(e);
    }
    this.setState({redirectToReferrer:true})
  }

  render() {
    if (this.state.redirectToReferrer) {
            return window.location.assign("/cars"); // <- this reloads a page and update state from back-end
        }
    return(
            <Container>
              <h4>Fill out the form to add new item:</h4>
              <Form onSubmit={this.handleSubmit}>
                <Row>
                  <Col lg={4}>
                    <Form.Group>
                      <Form.Label>Car brand:</Form.Label>
                      <Form.Control type="text" value={this.state.brand} name ="brand" onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Car model:</Form.Label>
                      <Form.Control type="text" value={this.state.model} name ="model" onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Car VIN# (*required):</Form.Label>
                      <Form.Control type="text" required value={this.state.vin} name ="vin" onChange={this.handleChange} />
                    </Form.Group>
                  </Col>

                  <Col lg={4}>
                    <Form.Group>
                      <Form.Label>Car color:</Form.Label>
                      <Form.Control type="text" value={this.state.color} name ="color" onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Car year:</Form.Label>
                      <Form.Control type="number" value={this.state.year} name ="year" onChange={this.handleChange} />
                    </Form.Group>
                  </Col>
                </Row>
                <Col lg={8}>
                  <Button type="submit">Create</Button>
                  <Button href="/cars" className="float-right" variant="danger">
                    Back
                  </Button>
                </Col>
              </Form>
            </Container>

    )
  }
}

export default withRouter(NewCarPage);
