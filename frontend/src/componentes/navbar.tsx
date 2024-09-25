import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Botones from './Botones';

type Props = {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void,
  nuevoArchivo: () => void,
  saveFileContent: () => void,
    handleEjecutar: (eventKey:string) => void,
    handleReportes: (eventKey:string) => void
  }

function Navb({handleFileUpload, nuevoArchivo, saveFileContent, handleEjecutar, handleReportes}: Props) {
    return (
      <>
        <Navbar bg="dark" data-bs-theme="dark">
          <Container>
            <Navbar.Brand href="#home">MENU</Navbar.Brand>
            <Nav className="me-auto">
            <Botones 
            handleFileUpload={handleFileUpload}
            nuevoArchivo={nuevoArchivo}
            saveFileContent={saveFileContent}

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