import React from 'react';
import './App.scss';
import Editor from './components/Editor';

class App extends React.Component 
{
  


  render() {
    return(
      <div className="App">
        <Editor></Editor>
        {/* <FabricCanvas></FabricCanvas> */}
    </div>
    );
  }
    
}

export default App;
