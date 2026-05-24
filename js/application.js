document.getElementById('membershipForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('fullName').value;
    
    alert(`Thank you, ${name}! Your membership application has been submitted successfully.`);
    this.reset();
});