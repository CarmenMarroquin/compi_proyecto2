import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

type Props = {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void,
  nuevoArchivo: () => void,
  saveFileContent: () => void,

  handleEjecutar: (eventKey:string) => void,
  handleReportes: (eventKey:string) => void
}



function Botones({ handleFileUpload, nuevoArchivo, saveFileContent,handleEjecutar, handleReportes}: Props) {
  return (
    <>
      <DropdownButton
            as={ButtonGroup}
            key={"ARCHIVO"}
            id={`dropdown-variants-${"ARCHIVO"}`}
            variant={"ARCHIVO".toLowerCase()}
            title={"ARCHIVO"}
          >
            <Dropdown.Item eventKey="1" as="label" htmlFor="file-upload">
              Abrir archivo
              <input
                type="file"
                id="file-upload"
                style={{ display: 'none' }}
                accept=".ci"
                onChange={handleFileUpload}
              />
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="2" onClick={nuevoArchivo}>
              Nuevo archivo
  
              </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="3" onClick={saveFileContent}>Guardar</Dropdown.Item>

          </DropdownButton>


          <DropdownButton
            as={ButtonGroup}
            key={"EJECUTAR"}
            id={`dropdown-variants-${"EJECUTAR"}`}
            variant={"EJECUTAR".toLowerCase()}
            title={"EJECUTAR"}
            onSelect={(eventkey) => handleEjecutar(eventkey === null ? "" : eventkey)}
          >
            <Dropdown.Item eventKey="1">Ejecutar</Dropdown.Item>

          </DropdownButton>


          <DropdownButton
            as={ButtonGroup}
            key={"REPORTES"}
            id={`dropdown-variants-${"REPORTES"}`}
            variant={"REPORTES".toLowerCase()}
            title={"REPORTES"}
            onSelect={(eventKey) => handleReportes(eventKey === null ? "" : eventKey)}
          >
            <Dropdown.Item eventKey="1">Reporte de errores</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="2">Arbol sintactico</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="3">Tabla de simbolos</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="4">Consola</Dropdown.Item>

          </DropdownButton>
          


    

    </>
  );
}

export default Botones;