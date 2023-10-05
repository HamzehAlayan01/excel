import { useState } from "react";
import * as XLSX from 'xlsx';
import { DataGrid } from '@mui/x-data-grid'; 
import Paper from '@mui/material/Paper'; 

function App() {

  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [excelData, setExcelData] = useState(null);

  const handleFile=(e)=>{
    let fileTypes = ['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/csv'];
    let selectedFile = e.target.files[0];
    if(selectedFile){
      if(selectedFile&&fileTypes.includes(selectedFile.type)){
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload=(e)=>{
          setExcelFile(e.target.result);
        }
      }
      else{
        setTypeError('Please select only excel file types');
        setExcelFile(null);
      }
    }
    else{
      console.log('Please select file');
    }
  }
  
  const handleFileSubmit=(e)=>{
    e.preventDefault();
    if(excelFile!==null){
      const workbook = XLSX.read(excelFile,{type: 'buffer'});
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet).map((row,index)=>({
        ...row,
        id:index,
      }));
      setExcelData(data);
    }
  }

  return (
    <div>

      <h3>Upload & View Excel Sheets</h3>

      <form onSubmit={handleFileSubmit}>
        <input type="file" required onChange={handleFile} />
        <button type="submit">UPLOAD</button>
        {typeError&&(
          <div role="alert">{typeError}</div>
        )}
      </form>

      <div>
  {excelData ? (
    <div>
      <Paper elevation={5}>
        <DataGrid
          rows={excelData}
          columns={Object.keys(excelData[0]).map((key) => ({
            field:key,
          }))}
        />
      </Paper>
    </div>
  ) : (
    <div>no file is uploaded yet</div>
  )}
</div>


  </div>
  );
}
export default App;