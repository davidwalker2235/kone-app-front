// LoadingDialog.tsx

import React from 'react';
import { Dialog, DialogContent, CircularProgress, styled } from '@mui/material';

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
});

const StyledDialogContent = styled(DialogContent)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'transparent',
});

const StyledCircularProgress = styled(CircularProgress)({
  color: '#ffffff',
});

type LoadingDialogProps = {
  open: boolean;
};

const LoadingDialog: React.FC<LoadingDialogProps> = ({ open }) => {
  return (
    <StyledDialog
      open={open}
      // Si deseas que el fondo sea transparente y no bloqueante, puedes eliminar el Backdrop o ajustarlo
      BackdropProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
        },
      }}
    >
      <StyledDialogContent>
        <StyledCircularProgress />
      </StyledDialogContent>
    </StyledDialog>
  );
};

export default LoadingDialog;