import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const Navigate = useNavigate();

    const isAuthenticated = () => {
        const token = localStorage.getItem("token");
        // Ajoutez ici la logique de vérification du token
        return !!token; // Retourne true si le token est présent, sinon false
    };

    if (isAuthenticated()) {
        return children;
    } else {
        Navigate("/login");
        return null;
    }
}

export default ProtectedRoute;
