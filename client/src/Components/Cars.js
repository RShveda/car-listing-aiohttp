import React, { Component } from 'react';
import { Button, Table, Container, Col, Form, Row } from 'react-bootstrap';
import DeleteCarModal from './DeleteCarModal';
import { Link } from "react-router-dom";


class Cars extends Component{
  constructor(props) {
    super(props);
    this.state = {
      deleteModals:{},
    };
    this.setDeleteModalShow = this.setDeleteModalShow.bind(this);
  }

  setDeleteModalShow(bool, id) {
    var deleteModals = this.state.deleteModals
    deleteModals[id] = bool
    this.setState({deleteModals});
  }

  render() {
    return (
      <Container>
        <h1>This is Cars list page!</h1>
        <h5>You may add a new car:</h5>
        <AddCar />
        <br/>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Year</th>
              <th>Color</th>
              <th>VIN</th>
              <th>Actions</th>
            </tr>
          </thead>
            <tbody>
             {this.props.data.cars.map(item => (
               <tr key={item._id.$oid}>
                 <td>{item._id.$oid}</td>
                 <td>{item.brand}</td>
                 <td>{item.model}</td>
                 <td>{item.year}</td>
                 <td>{item.color}</td>
                 <td>{item.vin}</td>
                 <td>
                   <Link to={{
                      pathname: `car/${item._id.$oid}/edit`,
                      state: { brand: item.brand, model: item.model, _id: item._id.$oid, vin: item.vin, }
                     }}>
                    <Button variant="primary">
                      View Record
                    </Button>
                   </Link>
                   <Button variant="danger" onClick={() => this.setDeleteModalShow(true, item._id.$oid)}>
                    Delete Car
                   </Button>
                   <DeleteCarModal
                     show={this.state.deleteModals[item._id.$oid]}
                     onHide={() => this.setDeleteModalShow(false, item._id.$oid)}
                     item={item}
                   />
                 </td>
                </tr>
             ))}
             </tbody>
         </Table>
      </Container>
    );
  }
}

class AddCar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brand: '',
      model: '',
      vin: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    try {
      fetch('http://localhost:8080/cars', {
          method: 'POST',
          body: JSON.stringify(this.state),
          headers: {
            'Content-Type': 'application/json'
          },
        }).then(function(response) {
            return response.text()
        }).then(function(data) {
            alert(data)
        });
    } catch(e) {
      alert(e)
    }

  }

  render() {
    return (
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
          <Button type="submit">Submit</Button>
        </Form>
    );
  }
}

export default Cars;
