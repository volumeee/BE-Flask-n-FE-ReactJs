import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createMember,
  updateMember,
  getMemberById,
  Member,
} from "../services/api";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Paper,
  TextField,
  Typography,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Alert,
  Slider,
  Card,
  CardContent,
} from "@mui/material";
import LogoIcon from "@mui/icons-material/AccountCircle";
import { createTheme, ThemeProvider } from "@mui/material/styles";

interface MemberFormProps {
  isEdit?: boolean;
}

const defaultTheme = createTheme();

const MemberForm: React.FC<MemberFormProps> = ({ isEdit = false }) => {
  const [member, setMember] = useState<Member>({
    id: "",
    name: "",
    position: "",
    reports_to: "",
    file_url: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [alert, setAlert] = useState<{
    severity: string;
    message: string;
  } | null>(null);
  const [skills, setSkills] = useState({
    leadership: 50,
    communication: 50,
    problemSolving: 50,
  });
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit && memberId) {
      const fetchMember = async () => {
        try {
          const response = await getMemberById(memberId);
          const fetchedMember = response.data;
          setMember(fetchedMember);
          setSkills({
            communication: fetchedMember.skills?.communication ?? 50,
            leadership: fetchedMember.skills?.leadership ?? 50,
            problemSolving: fetchedMember.skills?.problemSolving ?? 50,
          });
        } catch (error) {
          console.error("Failed to fetch member", error);
        }
      };
      fetchMember();
    }
  }, [isEdit, memberId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMember({ ...member, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setAlert({
          severity: "error",
          message: "Only JPG and PNG files are allowed.",
        });
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Skills saat submit:", skills); // Tambahkan log ini
    try {
      const formData = new FormData();
      formData.append("name", member.name);
      formData.append("position", member.position);
      formData.append("reports_to", member.reports_to || "");
      if (selectedFile) formData.append("file", selectedFile);
      formData.append("skills", JSON.stringify(skills));

      if (isEdit && memberId) {
        await updateMember(memberId, formData);
        setAlert({
          severity: "success",
          message: "Member updated successfully.",
        });
      } else {
        await createMember(formData);
        setAlert({
          severity: "success",
          message: "Member added successfully.",
        });
      }

      setTimeout(() => navigate("/members"), 2000);
    } catch (error) {
      console.error("Failed to save member", error);
      setAlert({ severity: "error", message: "Failed to save member." });
    }
  };

  const handleSkillChange = (skill: string, value: number) => {
    setSkills({ ...skills, [skill]: value });
    console.log(`Updated ${skill}:`, value);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Paper elevation={6} sx={{ padding: 4, marginTop: 8 }}>
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
            <LogoIcon fontSize="large" sx={{ marginRight: 2 }} />
            <Typography component="h1" variant="h5">
              {isEdit ? "Edit Member" : "Add Member"}
            </Typography>
          </Box>
          {alert && (
            <Alert
              severity={
                alert.severity as "success" | "error" | "warning" | "info"
              }
              sx={{ marginBottom: 2 }}
            >
              {alert.message}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Avatar
                  alt="Member Picture"
                  src={
                    selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : member.file_url
                      ? `http://localhost:5000${member.file_url}`
                      : ""
                  }
                  sx={{ width: 80, height: 80, marginBottom: 2, mx: "auto" }}
                />
                <Button variant="contained" component="label">
                  Upload Picture
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  variant="outlined"
                  required
                  fullWidth
                  label="Name"
                  value={member.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="position"
                  variant="outlined"
                  required
                  fullWidth
                  label="Position"
                  value={member.position}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Reports To</InputLabel>
                  <Select
                    name="reports_to"
                    value={member.reports_to}
                    onChange={(e) =>
                      handleChange(e as React.ChangeEvent<HTMLInputElement>)
                    }
                    label="Reports To"
                  >
                    <MenuItem value="Superior 1">Superior 1</MenuItem>
                    <MenuItem value="Superior 2">Superior 2</MenuItem>
                    <MenuItem value="Superior 3">Superior 3</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Skills Section */}
              <Grid item xs={12}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Skills & Expertise
                    </Typography>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="body2">Leadership</Typography>
                        <Slider
                          orientation="vertical"
                          value={skills.leadership}
                          onChange={(e, value) =>
                            handleSkillChange("leadership", value as number)
                          }
                          aria-labelledby="leadership-slider"
                          valueLabelDisplay="auto"
                          sx={{ height: 200 }}
                        />
                      </Box>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="body2">Communication</Typography>
                        <Slider
                          orientation="vertical"
                          value={skills.communication}
                          onChange={(e, value) =>
                            handleSkillChange("communication", value as number)
                          }
                          aria-labelledby="communication-slider"
                          valueLabelDisplay="auto"
                          sx={{ height: 200 }}
                        />
                      </Box>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="body2">Problem Solving</Typography>
                        <Slider
                          orientation="vertical"
                          value={skills.problemSolving}
                          onChange={(e, value) =>
                            handleSkillChange("problemSolving", value as number)
                          }
                          aria-labelledby="problem-solving-slider"
                          valueLabelDisplay="auto"
                          sx={{ height: 200 }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                >
                  {isEdit ? "Update Member" : "Add Member"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default MemberForm;
