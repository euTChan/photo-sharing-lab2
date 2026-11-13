import React, { useEffect, useState } from "react";
import { Typography, Button, Paper, Stack, Chip, Divider } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

function UserDetail() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setProfile(null);
    setError("");
    fetchModel(`/user/${userId}`)
      .then((user) => { if (active) setProfile(user); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [userId]);

  if (loading) return <Typography sx={{ p: 2 }}>Đang tải thông tin người dùng...</Typography>;
  if (error || !profile) {
    return <Typography variant="body1" sx={{ p: 2 }}>{error || "Không tìm thấy thông tin người dùng."}</Typography>;
  }

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Stack spacing={2} alignItems="flex-start">
        <div>
          <Typography variant="h4" gutterBottom>{profile.first_name} {profile.last_name}</Typography>
          <Stack direction="row" spacing={1}>
            <Chip label={`Nghề nghiệp: ${profile.occupation || "Chưa cập nhật"}`} variant="outlined" />
            <Chip label={`Địa chỉ: ${profile.location || "Chưa cập nhật"}`} variant="outlined" />
          </Stack>
        </div>
        <Divider flexItem />
        <div>
          <Typography variant="subtitle2" color="text.secondary">Giới thiệu:</Typography>
          <Typography variant="body1" sx={{ mt: 0.5 }}>{profile.description}</Typography>
        </div>
        <Button variant="contained" color="secondary" component={Link} to={`/photos/${profile._id}`}>
          Xem bộ sưu tập ảnh của {profile.first_name}
        </Button>
      </Stack>
    </Paper>
  );
}

export default UserDetail;
