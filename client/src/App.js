import React, { Component } from 'react';
import './App.css';
import Cars from './Components/Cars';
import EditCarPage from './Components/EditCarPage';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Jumbotron, Container, Navbar, Nav } from 'react-bootstrap';


class App extends Component {

  state = {
    cars:[],
  };

  constructor(props) {
    super(props);
    this.setCarState = this.setCarState.bind(this);
  }

  async componentDidMount() {
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

  setCarState(car){
    console.log("car");
  }

  render() {
    return (
      <Router>
        <div>
          <Container>
            <Navbar bg="light">
              <Nav className="mr-auto">
                  <Nav.Link as="span">
                    <Link to="/">Home</Link>
                  </Nav.Link>
                  <Nav.Link as="span">
                    <Link to="/cars">Cars</Link>
                  </Nav.Link>
              </Nav>
            </Navbar>
          </Container>
          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route exact path="/cars">
              <Cars data = {this.state}/>
            </Route>
            <Route path="/car/:carId/edit">
              <EditCarPage cars = {this.state.cars} />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

function Home() {
  return (
    <Container>
      <Jumbotron>
        <h1>This is a homepage</h1>
      </Jumbotron>
    </Container>
  )
}

export default App;
