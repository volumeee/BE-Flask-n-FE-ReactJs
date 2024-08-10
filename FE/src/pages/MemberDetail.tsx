import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMemberById, Member } from "../services/api";
import {
  Typography,
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  CircularProgress, // Import CircularProgress
} from "@mui/material";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  RadarController,
} from "chart.js";
import { Radar } from "react-chartjs-2";

// Register the necessary components for the radar chart
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  RadarController
);

const BACKEND_BASE_URL = "http://localhost:5000";

const MemberDetail: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await getMemberById(memberId!);
        setMember(response.data);
      } catch (error) {
        console.error("Failed to fetch member", error);
      }
    };
    fetchMember();
  }, [memberId]);

  // Show a loading spinner while data is being fetched
  if (!member)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Full height of the viewport
        }}
      >
        <CircularProgress /> {/* Spinning loading icon */}
      </Box>
    );

  const imageUrl = member.file_url
    ? `${BACKEND_BASE_URL}${member.file_url}`
    : "";

  const skillsData = member.skills
    ? [
        member.skills.communication,
        member.skills.leadership,
        member.skills.problemSolving,
      ]
    : [0, 0, 0];

  const data = {
    labels: ["Communication", "Leadership", "Problem Solving"],
    datasets: [
      {
        label: "Skills",
        backgroundColor: "rgba(34, 202, 236, .2)",
        borderColor: "rgba(34, 202, 236, 1)",
        pointBackgroundColor: "rgba(34, 202, 236, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(34, 202, 236, 1)",
        data: skillsData,
      },
    ],
  };

  const options = {
    scale: {
      ticks: {
        beginAtZero: true, // Start at zero
        min: 0, // Set minimum value to 0
        max: 100, // Set maximum value to 100
        stepSize: 20, // Set step size
        callback: function (value: number) {
          return value >= 0 ? value : null; // Only display positive values
        },
      },
      gridLines: {
        color: "rgba(34, 202, 236, 0.2)",
      },
      angleLines: {
        color: "rgba(34, 202, 236, 0.2)",
      },
    },
    legend: {
      display: false,
    },
    maintainAspectRatio: false,
  };

  return (
    <Box component="main" maxWidth="sm" sx={{ margin: "auto", padding: 2 }}>
      <Card sx={{ boxShadow: 3 }}>
        <CardHeader
          title={member.name}
          subheader={member.position}
          avatar={
            <Avatar
              alt={member.name}
              src={imageUrl}
              sx={{ width: 56, height: 56 }}
            />
          }
          sx={{
            textAlign: "start",
          }}
          subheaderTypographyProps={{ fontSize: 12 }}
          titleTypographyProps={{ fontWeight: "bold", fontSize: 20 }}
        />
        {imageUrl && (
          <CardMedia
            component="img"
            height="200"
            image={imageUrl}
            alt={member.name}
          />
        )}
        <CardContent>
          <Typography variant="body1" gutterBottom>
            <strong>Position:</strong> {member.position}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2">
            <strong>Reports To:</strong> {member.reports_to || "N/A"}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" component="div" sx={{ height: 300 }}>
            <Radar data={data} options={options} />
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MemberDetail;
