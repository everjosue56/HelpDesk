import { Navigate, Route, Routes } from "react-router-dom";
import { ListUsersPage } from "../pages/ListUsersPage";
import { DetailsUserPage } from "../pages/DetailsUserPage";
import { CreateUserPage } from "../pages/CreateUserPage";
import { EditUserPage } from "../pages/EditUserPage";


export const UsersRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<ListUsersPage />} />
            <Route path="details/:id" element={<DetailsUserPage />} />
             <Route path="create" element={<CreateUserPage />} />
              <Route path="edit/:id" element={<EditUserPage />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};