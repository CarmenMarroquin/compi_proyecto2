import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

type Props = {
  handleArchivos: (eventKey:string | null) => void,
  handleEjecutar: (eventKey:string | null) => void,
  handleReportes: (eventKey:string| null) => void
}

function Botones({ handleArchivos, handleEjecutar, handleReportes}: Props) {
  return (
    <>


      <DropdownButton
            as={ButtonGroup}
            key={"ARCHIVO"}
            id={`dropdown-variants-${"ARCHIVO"}`}
            variant={"ARCHIVO".toLowerCase()}
            title={"ARCHIVO"}
            onSelect={(eventKey) => handleArchivos(eventKey)}
          >
            <Dropdown.Item eventKey="1">Abrir archivo</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="2">Nuevo archivo</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="3">Guardar</Dropdown.Item>

          </DropdownButton>


          <DropdownButton
            as={ButtonGroup}
            key={"EJECUTAR"}
            id={`dropdown-variants-${"EJECUTAR"}`}
            variant={"EJECUTAR".toLowerCase()}
            title={"EJECUTAR"}
            onSelect={(eventkey) => handleEjecutar(eventkey)}
          >
            <Dropdown.Item eventKey="1">Ejecutar</Dropdown.Item>

          </DropdownButton>


          <DropdownButton
            as={ButtonGroup}
            key={"REPORTES"}
            id={`dropdown-variants-${"REPORTES"}`}
            variant={"REPORTES".toLowerCase()}
            title={"REPORTES"}
          >
            <Dropdown.Item eventKey="1">Reporte de errores</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="2">Arbol sintactico</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="3">Tabla de simbolos</Dropdown.Item>

          </DropdownButton>
          


    

    </>
  );
}

export default Botones;