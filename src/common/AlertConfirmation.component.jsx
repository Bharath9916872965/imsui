import { useEffect } from 'react';
import Swal from 'sweetalert2';

// const AlertConfirmation = ({ open, title, message, onConfirm, onClose }) => {
  
//   useEffect(() => {
//     const handleConfirm = async () => {

//       const result = await Swal.fire({
//         title: title ,
//         text: message ,
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonText: 'Yes',
//         cancelButtonText: 'No, cancel',
//         reverseButtons: true,
//         customClass: {
//           container: 'my-swal-container',
//           popup: 'my-swal-popup',
//         },
//       });

//       if (result.isConfirmed) {
//         if (onConfirm) onConfirm();
//         // Swal.fire(
//         //   'Deleted!',
//         //   'Your file has been deleted.',
//         //   'success'
//         // );
//       } else if (result.isDismissed) {
//         if (onClose) onClose();
//         Swal.fire(
//           'Cancelled',
//           '',
//           'error'
//         );
//       }
//     };

//     if (open) {
//       handleConfirm();
//     }
//   }, [open, title, message, onConfirm, onClose]);

//   return null; // No need for a button or other elements
// };



const AlertConfirmation = async ({ title, message }) => {
  const result = await Swal.fire({
    title: title,
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#2B682A',
    cancelButtonColor: '#C14141',
    confirmButtonText: 'YES',
    cancelButtonText: 'NO',
    // reverseButtons: true,
    customClass: {
      container: 'my-swal-container',
      popup: 'my-swal-popup',
    },
  });

  // if (result.isDismissed) {
  //   Swal.fire(
  //     'Cancelled',
  //     '',
  //     'error'
  //   );
  // }

  return result.isConfirmed;
};



export default AlertConfirmation;
