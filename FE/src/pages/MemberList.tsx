import React, { useEffect, useState } from "react";
import { getMembers, deleteMember, Member } from "../services/api";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  CircularProgress,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const MemberList: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [alert, setAlert] = useState<{
    severity: string;
    message: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const response = await getMembers();
        setMembers(response.data);
      } catch (error) {
        console.error("Failed to fetch members", error);
        setAlert({ severity: "error", message: "Failed to fetch members." });
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleDelete = async (memberId: string) => {
    try {
      await deleteMember(memberId);
      setMembers(members.filter((member) => member.id !== memberId));
      setAlert({
        severity: "success",
        message: "Member deleted successfully.",
      });
    } catch (error) {
      console.error(`Failed to delete member with ID ${memberId}`, error);
      setAlert({
        severity: "error",
        message: `Failed to delete member with ID ${memberId}.`,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("googleToken");
    navigate("/login");
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ padding: 10 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <AccountCircleIcon sx={{ fontSize: 40, mr: 2 }} />
        <Typography variant="h4">Members</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            variant="outlined"
            label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mr: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/members/new")}
          >
            Add Member
          </Button>
        </Box>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {alert && (
        <Alert
          severity={alert.severity as "success" | "error" | "warning" | "info"}
          message={alert.message}
        />
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Position</TableCell>
                <TableCell sx={{ textAlign: "end" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.position}</TableCell>
                  <TableCell sx={{ textAlign: "end" }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate(`/members/${member.id}`)}
                      sx={{ mr: 1 }}
                    >
                      View
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => navigate(`/members/edit/${member.id}`)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(member.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default MemberList;
