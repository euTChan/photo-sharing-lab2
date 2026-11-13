import React, { useEffect, useState } from "react";
import { List, ListItemButton, ListItemText, Divider, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

function UserList() {
  const [accountList, setAccountList] = useState([]);
  const [error, setError] = useState("");
  const { pathname } = useLocation();

  useEffect(() => {
    let active = true;
    fetchModel("/user/list")
      .then((users) => { if (active) setAccountList(users); })
      .catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, []);

  return (
    <div className="user-list-wrapper">
      <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: "text.secondary" }}>
        DANH SÁCH NGƯỜI DÙNG ({accountList.length})
      </Typography>
      <Divider />
      {error ? (
        <Typography color="error" sx={{ p: 2 }}>{error}</Typography>
      ) : (
        <List component="nav" disablePadding>
          {accountList.map((person) => (
            <React.Fragment key={person._id}>
              <ListItemButton component={Link} to={`/users/${person._id}`} selected={pathname.includes(person._id)}>
                <ListItemText primary={`${person.first_name} ${person.last_name}`} />
              </ListItemButton>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </div>
  );
}

export default UserList;
