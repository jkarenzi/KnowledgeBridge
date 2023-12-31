import { useParams } from "react-router-dom";
import '../components/Books.css';

const ViewBook = () => {
    const { id } = useParams()
    console.log(id)
    const url = `https://kbbackend.onrender.com/get_pdf/${id}`

    return (
        <body className="view_body">
            <embed src={url} type="application/pdf" width="100%" height="100%"/>
        </body>
    )
}

export default ViewBook;