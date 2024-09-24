
import Dropdown from 'react-bootstrap/Dropdown';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';





function Consola() {
    return (
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Consola</Form.Label>
          <Form.Control as="textarea" rows={3} />
        </Form.Group>
      </Form>
    );
  }
  
  export default Consola;

