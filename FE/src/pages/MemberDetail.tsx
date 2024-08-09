import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMemberById, Member } from "../services/api";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Avatar,
  Box,
} from "@mui/material";

const MemberDetail: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      setLoading(true);
      try {
        const res = await getMemberById(memberId!);
        setMember(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [memberId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!member) {
    return (
      <Typography variant="h6" color="text.secondary" align="center">
        Member not found.
      </Typography>
    );
  }

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 5, boxShadow: 3 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            src={member.avatarUrl || undefined}
            alt={member.name}
            sx={{ width: 80, height: 80, mr: 3 }}
          />
          <Typography variant="h4">{member.name}</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          <strong>Position:</strong> {member.position}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          <strong>Reports to:</strong> {member.reports_to}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MemberDetail;
