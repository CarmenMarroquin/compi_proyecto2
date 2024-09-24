import { useState } from 'react'
import Form from 'react-bootstrap/Form';





function Entrada() {
    return (
      <Form>
     <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Entrada</Form.Label>
          <Form.Control as="textarea" rows={3} />
        </Form.Group>
      </Form>
    );
  }
  
  export default Entrada;