export default function DeleteUser({ onDeleteUser }) {
  return (
    <button onClick={onDeleteUser} className="post-button">
      Supprimer mon compte
    </button>
  );
}
