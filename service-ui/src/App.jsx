import { useState, useEffect } from "react";
import { Button, TextField, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from "@mui/material";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({ name: "", email: "" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchUsers = async () => {
    const response = await fetch("http://localhost:8001/data");
    const data = await response.json();
    setUsers(data.data || []);
  };

  const updateUser = async (id) => {
    if (!updatedUser.name || !updatedUser.email) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    
    const response = await fetch("http://localhost:8001/data/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ update_filter: { _id: id }, new_data: updatedUser }),
      mode: "cors",
    });
    const data = await response.json();
    alert(data.message);
    fetchUsers();
    setEditingUser(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-3/4">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4 text-center">Modifier Utilisateurs</h2>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    {editingUser === user._id ? (
                      <TextField 
                        value={updatedUser.name} 
                        onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })} 
                        fullWidth 
                      />
                    ) : (
                      user.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUser === user._id ? (
                      <TextField 
                        value={updatedUser.email} 
                        onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })} 
                        fullWidth 
                      />
                    ) : (
                      user.email
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUser === user._id ? (
                      <Button variant="contained" onClick={() => updateUser(user._id)}>Enregistrer</Button>
                    ) : (
                      <Button 
                        variant="outlined" 
                        onClick={() => {
                          setEditingUser(user._id);
                          setUpdatedUser({ name: user.name, email: user.email });
                        }}
                      >Modifier</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function UserDashboard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const addUser = async () => {
    const response = await fetch("http://localhost:8000/user/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
      mode: "cors",
    });
    const data = await response.json();
    alert(data.message);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Portail Utilisateur</h1>
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Ajouter un utilisateur</h2>
          <div className="flex gap-4">
            <TextField label="Nom" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            <Button variant="contained" onClick={addUser}>Ajouter</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div  style={{width:"100vw", height:"100vh", display:"flex", flexDirection:"column", justifyContent:"space-around",alignItems:"center"}}>
      <div className="flex flex-col items-center gap-6 p-6 w-3/4">
        <div className="flex justify-center gap-4 " >
          <Button variant="outlined" onClick={() => setIsAdmin(false)}>Mode Utilisateur</Button>
          <Button variant="contained" onClick={() => setIsAdmin(true)}>Mode Admin</Button>
        </div>
        <div className="w-full flex justify-center" >
          {isAdmin ? <AdminDashboard /> : <UserDashboard />}
        </div>
      </div>
    </div>
  );
}
