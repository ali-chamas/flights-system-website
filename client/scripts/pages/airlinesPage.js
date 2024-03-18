const airlinesContainer = document.getElementById("airlines-container");
const filterBtn = document.getElementById("airlines-filter");

let airlines = [];

const getAirlines = async () => {
  try {
    const res = await fetch(`${apiURL}/airlines/airlinesApi.php`);
    const data = await res.json();
    airlines = data.airlines;
  } catch (error) {
    console.log(error);
  }
};

const generateAirlines = (array) => {
  array.forEach((a) => {
    airlinesContainer.innerHTML += `<a
                                        href="/client/pages/airlines/singleAirlinePage.html?id=${a.id}"
                                        class="flex column gap airline-card"
                                        >
                                        <img src="${a.logo}" alt="" />
                                        <div class="flex column gap p">
                                        <h2>${a.name}</h2>
                                        <div class="w-full flex justify-between">
                                            <small>10flights</small>
                                            <small><i class="fa-solid fa-star rate-color"></i> ${a.rating}</small>
                                        </div>
                                        </div>
                                        </a>`;
  });
};

const app = async () => {
  await getAirlines();
  generateAirlines(airlines);
  console.log(airlines);
};
app();
