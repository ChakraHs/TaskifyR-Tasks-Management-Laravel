import axios from 'axios';
import React, { useEffect, useState } from 'react'
import useCategories from '../../custom/useCategories';

export default function Tasks() {
    const [isLoading, setIsLoading] = useState(true); // Added isLoading state
    const [tasks,setTasks] = useState([]);
    const [categories,setCategories] = useState([]);

    const [page,setPage] = useState(1);

    const [catId,setCatId] = useState(null);

    const [orderBy,setOrderBy] = useState(null);

    const [searchTerm,setSearchTerm] = useState('');

    useEffect(()=>{
        fetchTasks();
        if(!categories.length){
            fetchCategories();
        }
        const delay = setTimeout(() => {
            setIsLoading(false);
        }, 1000); // Set isLoading to false once the page has finished loading
        return () => {
            clearTimeout(delay); // Clear the timeout if the component unmounts
        };
    }
    ,[page,catId,orderBy,searchTerm])

    const fetchTasks = async()=>{
        try {
            if(catId){
                const response = await axios.get(`/api/category/${catId}/tasks?page=${page}`);
                setTasks(response.data);
            }else if(orderBy){
                const response = await axios.get(`/api/order/${orderBy.column}/${orderBy.direction}/tasks?page=${page}`);
                setTasks(response.data);
            }else if(searchTerm){
                const response = await axios.get(`/api/search/${searchTerm}/tasks?page=${page}`);
                setTasks(response.data);
            }else{
                const response = await axios.get(`/api/tasks?page=${page}`);
                setTasks(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchCategories = async()=>{
            const fetchedCategories = await useCategories();
            setCategories(fetchedCategories);
            console.log(tasks);
    }

    const checkIfTaskIsDone = (done)=>(
        done ? (
            <span className="badge bg-seccess">
                Done
            </span>
        ) : (
            <span className="badge bg-danger">
                Processing
            </span>
        )
    )

    const fetchPrevNextTask = (link) => {
        const url = new URL(link);
        setPage(url.searchParams.get('page'));
        console.log(url.searchParams.get('page'));
    }

    const renderPagination = () => (
        <ul className="pagination">
            {tasks.links?.map((link,index)=>(
                <li key={index} className={`page-item ${link.active ? 'active' : '' }`}>
                    <a
                    style={{cursor:'pointer'}}
                    onClick={()=>fetchPrevNextTask(link.url)}
                    className="page-link">
                        {link.label.replace('&laquo;','').replace('&raquo;','')}
                    </a>
                </li>
            ))}
        </ul>
    )


    if (isLoading) {
        return (
            <div className="container" style={{width:"100%",height:"600px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div className="spinner-grow"></div>
            </div> // Render a loading indicator or message
        );
    }

    return (
        <div className="row my-5">
            <div className="row my-3">
                <div className="col-md-4">
                    <div className="form-group">
                        <input type="text"
                        value={searchTerm}
                        onChange={
                            (event) =>{
                                setPage(1);
                                setCatId(null);
                                setOrderBy(null);
                                setSearchTerm(event.target.value);
                            }
                        }
                        className="form-control rounded-0 border-dark"
                        placeholder='Search...'
                        />
                    </div>
                </div>
            </div>
            <div className="col-md-9 card">
                <div className="card-body">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Title</th>
                                <th>Body</th>
                                <th>Done</th>
                                <th>Category</th>
                                <th>Created</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tasks.data?.map(task=>(
                                    <tr key={task.id}>
                                        <td>{task.id}</td>
                                        <td>{task.title}</td>
                                        <td>{task.body}</td>
                                        <td>
                                            {
                                                checkIfTaskIsDone(task.done)
                                            }
                                        </td>
                                        <td>{task.category.name}</td>
                                        <td>{task.created_at}</td>
                                        <td></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <div className="my-4 d-flex justify-content-between">
                        <div>
                            Showing {tasks.from || 0} to {tasks.to || 0} from {tasks.total} results.
                        </div>
                        <div>
                            {renderPagination()}
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="card">
                    <div className="card-header text-center bg-white">
                        <h5 className="mt-2">Filter by category</h5>
                    </div>
                    <div className="card-body">
                        <div className="form-check">
                            <input type="radio" name="category" id='-1' className='form-check-input'
                            onClick={()=>{
                                setPage(1);
                                setOrderBy(null);
                                setCatId(null);
                            }}
                            checked = {!catId ? true : false }
                            />
                            <label htmlFor="-1" className="form-check-label">All</label>
                        </div>
                        {console.log("categories: ",categories)}
                        {categories?.map(categorie => (
                            <div key={categorie.id} className="form-check">
                                <input type="radio" name="category" className='form-check-input'
                                onChange={(event)=>{
                                    setPage(1);
                                    setOrderBy(null);
                                    setCatId(event.target.value);
                                }}
                                value={categorie.id}
                                id={categorie.id}
                                checked = {catId == categorie.id}
                                />
                                <label htmlFor={categorie.id} className="form-check-label">{categorie.name}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="card mt-2">
                    <div className="card-header text-center bg-white">
                        <h5 className="mt-2">
                            Order by
                        </h5>
                    </div>
                    <div className="card-body">
                        <div>
                            <h6>ID</h6>
                        </div>
                        <div className="form-check">
                            <input type="radio" name="id" id='id-1' className='form-check-input'
                            onChange={(event)=>{
                                setPage(1);
                                setCatId(null);
                                setOrderBy({
                                    column : 'id',
                                    direction : event.target.value
                                });
                            }}
                            checked = {(orderBy && orderBy.column === 'id' && orderBy.direction =='asc') ? true : false}
                            value = 'asc'
                            />
                            <label htmlFor="id-1" className="form-check-label">
                                <i className="fas fa-arrow-up"></i>
                            </label>
                        </div>
                        <div className="form-check">
                            <input type="radio" name="id" id='id-2' className='form-check-input'
                            onChange={(event)=>{
                                setPage(1);
                                setCatId(null);
                                setOrderBy({
                                    column : 'id',
                                    direction : event.target.value
                                });
                            }}
                            checked = {(orderBy && orderBy.column === 'id' && orderBy.direction ==='desc') ? true : false}
                            value='desc'
                            />
                            <label htmlFor="id-2" className="form-check-label">
                                <i className="fas fa-arrow-down"></i>
                            </label>
                        </div>

                        <hr />
                        <div>
                            <h6>Title</h6>
                        </div>
                        <div className="form-check">
                            <input type="radio" name="title" id='title-1' className='form-check-input'
                            onChange={(event)=>{
                                setPage(1);
                                setCatId(null);
                                setOrderBy({
                                    column : 'title',
                                    direction : event.target.value
                                });
                            }}
                            checked = {(orderBy && orderBy.column === 'title' && orderBy.direction =='asc') ? true : false}
                            value = 'asc'
                            />
                            <label htmlFor="title-1" className="form-check-label">
                                A-Z
                            </label>
                        </div>
                        <div className="form-check">
                            <input type="radio" name="title" id='title-2' className='form-check-input'
                            onChange={(event)=>{
                                setPage(1);
                                setCatId(null);
                                setOrderBy({
                                    column : 'title',
                                    direction : event.target.value
                                });
                            }}
                            checked = {(orderBy && orderBy.column === 'title' && orderBy.direction ==='desc') ? true : false}
                            value='desc'
                            />
                            <label htmlFor="title-2" className="form-check-label">
                                Z-A
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
};
