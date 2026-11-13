import React, { useEffect, useState } from "react";
import { Typography, Paper, Divider, Stack, Box } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

const formatReadableTime = (rawDate) => {
  if (!rawDate) return "";
  return new Date(rawDate).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit",
  });
};

const getPhotoSource = (fileName) => {
  try {
    return require(`../../images/${fileName}`);
  } catch (err) {
    return `/images/${fileName}`;
  }
};

function UserPhotos() {
  const { userId } = useParams();
  const [userPhotoList, setUserPhotoList] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setUserPhotoList([]);
    setError("");
    fetchModel(`/photosOfUser/${userId}`)
      .then((photos) => { if (active) setUserPhotoList(photos); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [userId]);

  if (loading) return <Typography sx={{ p: 2 }}>Đang tải ảnh...</Typography>;
  if (error) return <Typography color="error" sx={{ p: 2 }}>{error}</Typography>;
  if (userPhotoList.length === 0) {
    return <Typography variant="body1" sx={{ p: 2 }}>Người dùng này chưa đăng bức ảnh nào.</Typography>;
  }

  return (
    <Stack spacing={3} sx={{ p: 2 }}>
      {userPhotoList.map((item) => {
        const commentList = item.comments || [];
        return (
          <Paper key={item._id} variant="outlined" sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
              Đăng lúc: {formatReadableTime(item.date_time)}
            </Typography>
            <Box sx={{ my: 1 }}>
              <img src={getPhotoSource(item.file_name)} alt={item.file_name}
                style={{ maxWidth: "100%", maxHeight: "380px", borderRadius: "4px" }} />
            </Box>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="subtitle2" gutterBottom>Bình luận ({commentList.length}):</Typography>
            {commentList.length > 0 ? (
              <Stack spacing={1.5} sx={{ mt: 1 }}>
                {commentList.map((cmt) => (
                  <Box key={cmt._id} sx={{ p: 1.5, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      {cmt.user ? (
                        <Typography variant="body2" component={Link} to={`/users/${cmt.user._id}`}
                          sx={{ fontWeight: "bold", textDecoration: "none", color: "primary.main" }}>
                          {cmt.user.first_name} {cmt.user.last_name}
                        </Typography>
                      ) : <Typography variant="body2">Người dùng không xác định</Typography>}
                      <Typography variant="caption" color="text.secondary">{formatReadableTime(cmt.date_time)}</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>{cmt.comment}</Typography>
                  </Box>
                ))}
              </Stack>
            ) : <Typography variant="body2" color="text.secondary">Chưa có bình luận nào.</Typography>}
          </Paper>
        );
      })}
    </Stack>
  );
}

export default UserPhotos;
