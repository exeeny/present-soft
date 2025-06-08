import EditPresentation from "./pages/EditPresentation";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from "./pages/Home";

const App = () => {
  return (
   <>
   <Router>
    <Routes>
      <Route path="presentations/:id" element={<EditPresentation />}  />
      <Route path="/" element={<Home />}  />
    </Routes>
   </Router>
   </>
  );
};

export default App;
