import React from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { Redirect, withRouter } from "react-router-dom";


class EditCarPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brand: "",
      model: "",
      vin: "",
      color: "",
      year: "",
      _id: "",
      redirectToReferrer: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    fetch('http://localhost:8080/cars/' + this.props.match.params.carId, {
        method: 'GET',
      }).then(function(response) {
        return response.json();
      }).then((response)=>
    {
      this.setState(JSON.parse(response))
    });
  }


  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  async handleSubmit(event) {
    event.preventDefault()
    try {
        var data = this.state;
        delete data._id;
        delete data.redirectToReferrer;
        await fetch('http://localhost:8080/cars/' + this.props.match.params.carId, {
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
              <h4>This Car ID is: {this.state._id.$oid}</h4>
              <Form onSubmit={this.handleSubmit}>
                <Row>
                  <Col lg={4}>
                    <Form.Group>
                      <Form.Label>Edit brand:</Form.Label>
                      <Form.Control type="text" value={this.state.brand} name ="brand" onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Edit model:</Form.Label>
                      <Form.Control type="text" value={this.state.model} name ="model" onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Edit VIN:</Form.Label>
                      <Form.Control type="text" required value={this.state.vin} name ="vin" onChange={this.handleChange} />
                    </Form.Group>
                  </Col>

                  <Col lg={4}>
                    <Form.Group>
                      <Form.Label>Edit color:</Form.Label>
                      <Form.Control type="text" value={this.state.color} name ="color" onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Edit year:</Form.Label>
                      <Form.Control type="number" value={this.state.year} name ="year" onChange={this.handleChange} />
                    </Form.Group>
                  </Col>
                </Row>
                <Col lg={8}>
                  <Button type="submit">Update</Button>
                  <Button href="/cars" className="float-right" variant="danger">
                    Back
                  </Button>
                </Col>
              </Form>
            </Container>

    )
  }
}

export default withRouter(EditCarPage);
