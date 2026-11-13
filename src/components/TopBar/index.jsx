import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

function TopBar() {
  const { pathname } = useLocation();
  const [headerStatus, setHeaderStatus] = useState("");

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length !== 2 || !["users", "photos"].includes(segments[0])) {
      setHeaderStatus("");
      return undefined;
    }

    let active = true;
    fetchModel(`/user/${segments[1]}`)
      .then((user) => {
        if (!active) return;
        const name = `${user.first_name} ${user.last_name}`;
        setHeaderStatus(segments[0] === "photos" ? `Photos of ${name}` : name);
      })
      .catch(() => { if (active) setHeaderStatus(""); });

    return () => { active = false; };
  }, [pathname]);

  return (
    <AppBar className="topbar-appBar" position="absolute" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" color="inherit">Trần Trí Tuệ - B23DCAT324</Typography>
        <Typography variant="subtitle1" color="inherit" sx={{ fontWeight: 500 }}>
          {headerStatus}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
