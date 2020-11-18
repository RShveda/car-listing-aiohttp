import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';


class DeleteCarModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.item._id.$oid,
      vin: props.item.vin,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    fetch('http://localhost:8080/cars/' + this.state.id, {
        headers: {'Content-Type': 'application/json'},
        method: 'DELETE',
        body: JSON.stringify(this.state)
      }).then(function(response) {
        return response.text();
      });
  }

  render() {
    return(
      <Modal
            show={this.props.show}
            onHide = {this.props.onHide}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Delete person
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h4>Are you sure you wan to delete a car with vin: {this.state.vin}?</h4>
              <Form onSubmit={this.handleSubmit}>
                <Button type="submit">Submit</Button>
                <Button className="float-right" variant="outline-danger" onClick={this.props.onHide}>Cancel</Button>
              </Form>
            </Modal.Body>
          </Modal>
    )
  }
}

export default DeleteCarModal;
