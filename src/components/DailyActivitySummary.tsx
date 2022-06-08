import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { palette } from "@mui/system";

const DailyActivitySummary = () => {
  const leftPanel = 7;

  return (
    <>
      <Stack>
        <Box sx={{ width: "100%" }}>
          <Typography fontWeight={"light"}>Today's Activity</Typography>
        </Box>
        <Box
          bgcolor="secondary.main"
          borderRadius={2}
          sx={{
            display: "flex",
            // border: "1px dashed white",
            width: "100%",
            height: "min-content",
          }}
        >
          <Grid container>
            <Grid
              item
              xs={leftPanel}
              // spacing={20}
              sx={{
                // border: "1px solid pink",
                width: "100%",
                // alignItems: "center",
                pt: "1.2rem",
                pb: "1rem",
                pr: "5rem",
              }}
            >
              <Stack spacing={2}>
                <Stack sx={{ alignItems: "center" }}>
                  <Typography fontSize={".9rem"} fontWeight="light">
                    Weight Moved
                  </Typography>
                  <Typography width={"max-content"}> - </Typography>
                </Stack>
                <Stack sx={{ alignItems: "center" }}>
                  <Typography fontSize={".9rem"} fontWeight="light">
                    Sets Completed
                  </Typography>
                  <Typography width={"max-content"}> - </Typography>
                </Stack>
                <Stack sx={{ alignItems: "center" }}>
                  <Typography fontSize={".9rem"} fontWeight="light">
                    Personal Bests
                  </Typography>
                  <Typography width={"max-content"}> - </Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid
              item
              component={Box}
              xs={12 - leftPanel}
              //   sx={{ border: "1px solid green" }}
            ></Grid>
          </Grid>
        </Box>
      </Stack>
    </>
  );
};

export default DailyActivitySummary;
