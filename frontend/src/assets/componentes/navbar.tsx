import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Botones from './Botones';

type Props = {
    handleArchivos: (eventKey:string| null) => void,
    handleEjecutar: (eventKey:string| null) => void,
    handleReportes: (eventKey:string| null) => void
  }

function Navb({handleArchivos, handleEjecutar, handleReportes}: Props) {
    return (
      <>
        <Navbar bg="dark" data-bs-theme="dark">
          <Container>
            <Navbar.Brand href="#home">MENU</Navbar.Brand>
            <Nav className="me-auto">
            <Botones 
            handleArchivos={handleArchivos}
            handleEjecutar={handleEjecutar}
            handleReportes={handleReportes}
            />
            </Nav>
          </Container>
        </Navbar>
        </>
  );
}
export default Navb;  