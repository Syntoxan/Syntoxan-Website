 function scrollNext() {
    const track = document.getElementById('imageTrack');
    track.scrollBy({ left: 155, behavior: 'smooth' });
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
    }
}

function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('menuOverlay').classList.toggle('active');
}





const heartGroup = document.querySelector('.icon-group');
const heartIcon = document.querySelector('.icon-group svg');


heartIcon.addEventListener('click', function() {
    heartIcon.classList.toggle('liked');
    heartGroup.classList.toggle('liked');
});
