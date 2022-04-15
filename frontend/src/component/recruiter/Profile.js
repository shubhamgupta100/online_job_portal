import { useContext, useEffect, useState } from "react";
import {
  // Button,
  Grid,
  // Typography,
  // Modal,
  Paper,
  makeStyles,
  TextField,
} from "@material-ui/core";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import { SetPopupContext } from "../../App";

import apiList from "../../lib/apiList";
import Loading from "../Loading";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // padding: "30px",
  },
}));

const Profile = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const [loading, setLoading] = useState(true);
  const [profileDetails, setProfileDetails] = useState({
    name: "",
    bio: "",
    contactNumber: "",
  });

  const [phone, setPhone] = useState("");

  const handleInput = (key, value) => {
    setProfileDetails({
      ...profileDetails,
      [key]: value,
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(apiList.user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        // console.log(response.data);
        setProfileDetails(response.data);
        setPhone(response.data.contactNumber);
        setLoading(false);
      })
      .catch((err) => {
        // console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  const handleUpdate = () => {
    let updatedDetails = {
      ...profileDetails,
    };
    if (phone !== "") {
      updatedDetails = {
        ...profileDetails,
        contactNumber: `+${phone}`,
      };
    } else {
      updatedDetails = {
        ...profileDetails,
        contactNumber: "",
      };
    }

    axios
      .put(apiList.user, updatedDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        getData();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        // console.log(err.response);
      });
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Grid
          container
          item
          direction="column"
          alignItems="center"
          style={{ padding: "30px", minHeight: "93vh" }}
        >
          <Grid item>
            <h1
              className="border_bottom"
              style={{ fontWeight: "bolder", marginTop: "-30px" }}
            >
              Profile
            </h1>
          </Grid>
          <Grid item xs style={{ width: "70%" }}>
            <Paper
              style={{
                padding: "30px 30px",
                outline: "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderTopLeftRadius: "50px",
                borderBottomRightRadius: "50px",
                border: "1px solid rgb(224, 222, 222)",
                //   width: "60%",
              }}
              elevation={1}
            >
              <Grid
                container
                direction="column"
                alignItems="stretch"
                spacing={3}
              >
                <Grid item>
                  <TextField
                    label="Name"
                    value={profileDetails.name}
                    onChange={(event) =>
                      handleInput("name", event.target.value)
                    }
                    className={classes.inputBox}
                    variant="outlined"
                    fullWidth
                    style={{ width: "100%" }}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Bio (upto 250 words)"
                    multiline
                    rows={8}
                    style={{ width: "100%" }}
                    variant="outlined"
                    value={profileDetails.bio}
                    onChange={(event) => {
                      if (
                        event.target.value.split(" ").filter(function (n) {
                          return n !== "";
                        }).length <= 250
                      ) {
                        handleInput("bio", event.target.value);
                      }
                    }}
                  />
                </Grid>
                <Grid
                  item
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <PhoneInput
                    country={"in"}
                    value={phone}
                    onChange={(phone) => setPhone(phone)}
                    style={{ width: "auto" }}
                  />
                </Grid>
              </Grid>
              <button
                className="profile_btn_recruiter"
                // variant="contained"
                // color="primary"
                // style={{ padding: "10px 50px", marginTop: "30px" }}
                onClick={() => handleUpdate()}
              >
                Update Details
              </button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Profile;
