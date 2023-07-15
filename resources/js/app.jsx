import './bootstrap';
import ReactDom from "react-dom/client";
import Tasks from './components/tasks/Tasks';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Create from './components/tasks/Create';
import Edit from './components/tasks/Edit';

const rootElement = document.getElementById('app');
ReactDom.createRoot(rootElement).render(
    <div className="row">
        <div className="col-md-12 mx-auto">
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path='/' element={<Tasks />} />
                    <Route path='/create' element={<Create />} />
                    {/* <Route path='/hoc' element={<HightOrderComponent><AddContact /></HightOrderComponent>} /> */}
                    <Route path='/edit/:taskId' element={<Edit />} />
                </Routes>
            </BrowserRouter>
        </div>
    </div>
);
