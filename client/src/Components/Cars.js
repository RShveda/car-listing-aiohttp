import React, { Component } from 'react';
import { Button, Table, Container, Form } from 'react-bootstrap';
import DeleteCarModal from './DeleteCarModal';
import { Link } from "react-router-dom";


class Cars extends Component{
  constructor(props) {
    super(props);
    this.state = {
      deleteModals:{},
      filter: "",
      cars: [],
    };
    this.handleResetFilter = this.handleResetFilter.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFilterList = this.handleFilterList.bind(this);
    this.setDeleteModalShow = this.setDeleteModalShow.bind(this);
  }

  async componentDidMount(){
    try {
      const res = await fetch('http://localhost:8080/cars');
      const data = await res.json();
      const cars = JSON.parse(data)
      this.setState({
        cars
      });
    } catch (e) {
      console.log(e);
    }
  }

  setDeleteModalShow(bool, id) {
    var deleteModals = this.state.deleteModals
    deleteModals[id] = bool
    this.setState({deleteModals});
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  async handleResetFilter(event) {
    await this.setState({filter:""});
    await this.handleFilterList(event)
  }

  async handleFilterList(event) {
    event.preventDefault()
    const query = (this.state.filter ? ('?model=' + this.state.filter) : "")
    try {
      const res = await fetch('http://localhost:8080/cars' + query);
      const data = await res.json();
      const cars = JSON.parse(data)
      this.setState({cars:cars});
    } catch (e) {
      console.log(e);
    }

  }

  render() {
    return (
      <Container>

        <h1>This is Cars list page!</h1>
        <h5>You may add a new car:</h5>
        <Link to="/cars/new">
         <Button variant="primary">
           New Car
         </Button>
        </Link>
        <Form className="float-right" onSubmit={this.handleFilterList}>
          <Form.Group>
            <Form.Label>Filter by Car Model:</Form.Label>
            <Form.Control type="text" value={this.state.filter} name ="filter" onChange={this.handleChange} />
            <Button className="Button" type="submit">Filter</Button>
            <Button className="float-right" className="Button" variant="secondary" onClick={this.handleResetFilter}>Reset Filter</Button>
          </Form.Group>
        </Form>

        <br/>
        <br/>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>VIN</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Year</th>
              <th>Color</th>
              <th>ID</th>
              <th>Actions</th>
            </tr>
          </thead>
            <tbody>
             {this.state.cars.map(item => (
               <tr key={item._id.$oid}>
                 <td>{item.vin}</td>
                 <td>{item.brand}</td>
                 <td>{item.model}</td>
                 <td>{item.year}</td>
                 <td>{item.color}</td>
                 <td>{item._id.$oid}</td>
                 <td>
                   <Link to={{
                      pathname: `car/${item._id.$oid}/edit`,
                      state: { brand: item.brand, model: item.model, _id: item._id.$oid, vin: item.vin, }
                     }}>
                    <Button variant="primary" className="Button">
                      View Record
                    </Button>
                   </Link>
                   <Button variant="danger" className="Button" onClick={() => this.setDeleteModalShow(true, item._id.$oid)}>
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

export default Cars;
