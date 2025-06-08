import parse from 'html-react-parser';

function Slide({content}) {
  return (
    <div >
        {parse(content)}
    </div>
  )
}

export default Slide