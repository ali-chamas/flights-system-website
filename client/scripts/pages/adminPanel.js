totalUsers = document.getElementById("number-of-users");
totalBookings = document.getElementById("total-bookings");
revenue = document.getElementById("revenue");

const getUsers = () => {
    fetch("http://localhost/flights-system-website/server/statistics/totalUsers.php", {
        method: "GET",
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            updateUsersCard(data.totalUsers);
        })
        .catch((error) => {
            console.error(error);
        });
};

const getBookings = () => {
    fetch("http://localhost/flights-system-website/server/statistics/totalBookings.php", {
        method: "GET",
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            updateBookingsCard(data.totalBookings);
        })
        .catch((error) => {
            console.error(error);
        });
};

const getRevenueAmount = () => {
    fetch("http://localhost/flights-system-website/server/statistics/revenueAmount.php", {
        method: "GET",
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            updateRevenueCard(data.totalRevenue);
        })
        .catch((error) => {
            console.error(error);
        });
};

const updateUsersCard = (numUsers) => {
    totalUsers.innerHTML = `${numUsers}`
}

const updateBookingsCard = (numBookings) => {
    totalBookings.innerHTML = `${numBookings}`
}

const updateRevenueCard = (numRevenue) => {
    revenue.innerHTML = `${numRevenue}`
}

getRevenueAmount();
getBookings();
getUsers();