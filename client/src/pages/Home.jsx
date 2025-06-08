import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'


function Home() {
  const [presentations, setPresentations] = useState([])
  const apiUrl = import.meta.env.VITE_API_URL
  const [user, setUser] = useState('')
  const navigate = useNavigate()

  const fetchPresentations = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/presentations`)
      console.log(res)
      setPresentations(res.data.member)
    } catch (error) {
      console.log(error)
    }
  }

  const login = async () => {
    let nickname = localStorage.getItem("nickname");
    if (!nickname) {
      const { value: enteredNickname } = await Swal.fire({
        title: "Enter your nickname",
        input: "text",
        inputLabel: "nickname",
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "You need to write something!";
          }
        }
      });

      if (enteredNickname) {
        Swal.fire(`You are logged in as ${enteredNickname}`);
        localStorage.setItem("nickname", enteredNickname);
        nickname = enteredNickname;
      }
    }

    if (nickname) {
      setUser(nickname);
      fetchPresentations()
    }
  }
  useEffect(() => {
    login()
  }, [])

  const addPresentation = async () => {
    try {
      const res = await axios.post(`${apiUrl}/api/presentations`, {
        title: 'My New Presentation',
        owner: user
      }, {
        headers: { 'Content-Type': 'application/ld+json' }
      })
      console.log(res)
      setPresentations(prev => [...prev, res.data])
    } catch (error) {
      console.log(error)
    }
  }
  if (!presentations) return <div>Loading...</div>;
  return (
    <div className='p-3 text-center'>
      <h1>Presentations</h1>
      <div className='mb-3 d-flex justify-content-center gap-3'>
        <button type="button" className='btn btn-outline-primary' onClick={addPresentation}>add presentation</button>
        <button onClick={() => {
          localStorage.removeItem("nickname");
          navigate(0)
        }} className="btn btn-outline-danger">Log Out</button>
      </div>

      {presentations.length === 0 ? <h2>There are no presentations yet, add one first!</h2> :
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">slides</th>
              <th scope="col">created at</th>
              <th scope="col">owner</th>
              <th scope="col">editors</th>
            </tr>
          </thead>
          <tbody>
            {presentations.map((p) =>
              <tr>
                <th scope="row">{p.id}</th>
                <td><Link to={`/presentations/${p.id}`}>{p.title}</Link></td>
                <td>{p.slides.length}</td>
                <td>{new Date(p.createdAt).toLocaleString()}</td>
                <td>{p.owner}</td>
                <td>no editors yet</td>
              </tr>
            )}
          </tbody>
        </table>
      }

    </div>
  )
}

export default Home