import Swal from "sweetalert2";

export default async function confirmDelete(title: string) {
  const result = await Swal.fire({
    title,
    text: "You can't undo this.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
    confirmButtonColor: "#dc2626", 
  });

  return result.isConfirmed;
}