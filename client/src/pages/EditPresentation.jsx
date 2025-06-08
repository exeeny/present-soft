import { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios'
import Slide from '../components/Slide';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
// import required modules
import { Navigation } from 'swiper/modules';


function EditPresentation() {
  const editorKey = import.meta.env.VITE_EDITOR_KEY;
  const apiUrl = import.meta.env.VITE_API_URL
  let navigate = useNavigate();
  const { id } = useParams();
  const [presentation, setPresentation] = useState();
  const [active, setActive] = useState()
  const editorRef = useRef(null);
  const swiperRef = useRef(null);
  const [user, setUser] = useState(localStorage.getItem('nickname'))

  const fetchPresentation = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/presentations/${id}`)
      setPresentation(res.data)
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    console.log(user)
    fetchPresentation()
  }, [])

  const add = async () => {
      try {
        const res = await axios.post(`${apiUrl}/api/slides`, {
        "content": "<h1>my new slide</h1>",
        "presentation": `/api/presentations/${id}`
      }, {
        headers: {
          'Content-Type': 'application/ld+json'

        }
      })
      console.log(res)
      setPresentation(prev => ({
      ...prev,
      slides: [...prev.slides, res.data]
      
    }));
    
    if (swiperRef.current) {
      swiperRef.current.slideTo(presentation.slides.length); // slides are 0-indexed
    }
 

      } catch (error) {
        console.log(error)
      
    }
  };

  const removeSlide = async (index) => {
    
    try {
      const res = await axios.delete(`${apiUrl}/api/slides/${index}`)
      console.log(res)
      setPresentation(prev => ({
      ...prev,
      slides: prev.slides.filter(slide => slide.id !== index)
    }));
    } catch (error) {
      console.log(error)
    }
  };

  const editSlide = async (index) => {
    if (!editorRef.current) return;
    const content = editorRef.current.getContent();
    try {
      const res = await axios.patch(`${apiUrl}/api/slides/${index}`, {
          "content": content,
          "presentation": `/api/presentations/${id}`
      }, {
        headers: {
          'Content-Type': 'application/merge-patch+json'
        }
      })
      console.log(res)
       setPresentation(prev => ({
      ...prev,
      slides: prev.slides.map(slide => 
        slide.id === index 
          ? { ...slide, content: content } 
          : slide
      )

    }));
    setActive(null)
    } catch (error) {
      console.log(error)
    }
  }

  const editor = (index) => {
    setActive(index)
  }

  const deletePresentation = async () => {
    try {
      const res = await axios.delete(`${apiUrl}/api/presentations/${id}`)
      console.log(res)
      navigate("/");

    } catch (error) {
      console.log(error)
    }
  }

  const handleTitleChange = (e) => {
    setPresentation(prev => ({
      ...prev,
      title: e.target.value
    }));
  };

  const saveTitle = async () => {
    try {
      const res = await axios.patch(`${apiUrl}/api/presentations/${id}`, {
        "title": presentation.title,
      }, {
        headers: {
          'Content-Type': 'application/merge-patch+json'
        }
      })
      console.log(res)
      
    } catch (error) {
      console.log(error)
    }
  }




  if (!presentation) return <div>Loading...</div>;

  return (
    <div className='container-fluid p-3'>
      <div className='d-flex w-50 gap-3 align-items-center mb-3'>
      {user === presentation.owner ? <>
        <input  className='form-control' type="text" onChange={handleTitleChange} value={presentation.title} />
        <button className=" btn btn-outline-secondary"  onClick={saveTitle}>saveTitle</button>
       </> : <> <h1 className='mb-3'>{presentation.title}</h1>
                <h3 className='fw-light'>by {presentation.owner}</h3>  </>} </div>
      
      
      {user === presentation.owner && <div className='mb-3 d-flex justify-content-between'>
        <button type='button' className='btn btn-primary' onClick={add}>add slide</button>
        <button type='button' className='btn btn-danger' onClick={deletePresentation}>delete presentation</button>
      </div>}
      
    <Swiper onSwiper={(swiper) => {
    swiperRef.current = swiper;
  }} onSlideChange={() =>
        setActive(null)}     
        navigation={true} modules={[Navigation]}
         className="mySwiper"
         style={{ height: '700px', position: 'relative' }}>
    {presentation.slides.map((slide) =>
    <>
         <SwiperSlide className='p-3 border rounded '>
      {active === slide.id ?
      <> <Editor
              apiKey={`${editorKey}`}
              onInit={(_evt, editor) => editorRef.current = editor}
              initialValue={slide.content}
              init={{
                height: 600,
                menubar: false,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
            /> 
            <div className='d-flex justify-items-start gap-3 mt-3'>
              <button type="button" className="btn btn-outline-secondary" onClick={()=> editSlide(slide.id)}>Update slide</button>
              <button type="button" className="btn btn-outline-danger" onClick={() => removeSlide(slide.id)}>delete</button>
            </div>
            
            </> 
              :
            <div> <Slide content = {slide.content} />
            {user === presentation.owner && <button className='btn btn-primary btn-sm position-absolute bottom-0 end-0 m-3' onClick={() => editor(slide.id)}>edit</button>}
            
            
    </div> }</SwiperSlide>  </> )
    } </Swiper>
    <Link to='/'>go back to presentations</Link>
    </div>
  )
}

export default EditPresentation