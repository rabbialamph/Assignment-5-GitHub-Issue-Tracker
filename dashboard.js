const issuesContainer = document.getElementById("issuesContainer");
const issuesModal = document.getElementById("issuesModal");
const modalTitle = document.getElementById("modalTitle");
const modalLabels = document.getElementById("modalLabels");
const modalStatus = document.getElementById("modalStatus");
const modalAuthor = document.getElementById("modalAuthor");
const modalDate = document.getElementById("modalDate");
const modalDescription = document.getElementById("modalDescription");
const modalAuthorName = document.getElementById("modalAuthorName");
const modalPriority = document.getElementById("modalPriority");
const issuesCount = document.getElementById("issuesCount");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const loadSpinner = document.getElementById("loadSpinner");
const statusBtn = document.querySelectorAll("#statusBtn button");



let allIssues = [];

const loadData = async () =>{
loadSpinner.classList.remove("hidden");
   const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
   const data = await res.json()
//    console.log(data);
  allIssues = data.data;
   loadDisplayData(allIssues);
loadSpinner.classList.add("hidden");
};
loadData();

const priorityColor = { 
    high: "bg-red-200 text-red-700", 
    medium: "bg-yellow-200 text-yellow-700", 
    low: "bg-gray-200 text-gray-700" 
};

const statusBorderColor = {
  open: "border-green-700",
  closed: "border-purple-700"
};

const statusIcon = {
  open: "assets/Open-Status.png",
  closed: "assets/Closed-Status.png"
};

const loadDisplayData = (issues) =>{
    issuesContainer.innerHTML = "";

       issues.forEach(issue => {
        const div = document.createElement("div");
        div.addEventListener("click", () => openModal(issue.id));


        div.className = `shadow-sm rounded-[8px] bg-white p-3 border-t-4 ${statusBorderColor[issue.status]} issue-card status-${issue.status}`;


        const icons = [
           '<i class="fa-solid fa-hand-peace"></i>',
           '<i class="fa-solid fa-podcast"></i>'
            ];

        labelColor = [
             "text-red-700 bg-red-100 border-red-300",
             "text-amber-700 bg-yellow-100 border-yellow-300 "
        ];

             const labelsHTML = issue.labels.map((label, index) => {
             const icon = icons[index] || '<i class="fa-solid fa-podcast"></i>';
             const color = labelColor[index] || labelColor[0];

               return `
                    <p class="${color} font-medium p-1 border-2 text-center rounded-[12px]"> ${icon} ${label}</p>`;
               }).join("");

        div.innerHTML = `<div class="flex justify-between">
                     <img class="h-8 w-8" src="${statusIcon[issue.status]}" alt="">

                      <p class="${priorityColor[issue.priority]} font-medium text-center p-1 rounded-[12px] w-20">${issue.priority}</p>
                </div>

                <div class="mt-4">
                    <h2 class="font-semibold text-[24px]">${issue.title}</h2>
                    <p class="issue-description line-clamp-2 text-gray-500 mt-2">${issue.description}</p>

                   
                     <div class="mt-4 flex gap-3">
                      ${labelsHTML}
                     </div>
                    
                    <div class="border-1 border-gray-100 my-6"></div>
                    <div class="space-y-2">
                        <h2 class="text-gray-600">#${issue.id} by ${issue.author}</h2>
                        <data class="text-gray-600">${issue.createdAt}</data>
                    </div>
                </div>`;
    issuesContainer.appendChild(div);
    });
    issuesCount.textContent = `${issues.length} Issue${issues.length !== 1 ? 's' : ''}`;
};

statusBtn.forEach(btn => {
    btn.addEventListener("click", () =>{
       statusBtn.forEach(b => {
        b.classList.remove("btn-primary");
        b.classList.add("btn");
       });
       btn.classList.add("btn-primary");
       btn.classList.remove("btn-outline");

       let status = "all";
       if(btn.classList.contains("status-open")) status = "open";
       else if (btn.classList.contains("status-closed")) status = "closed";

       const allCards = document.querySelectorAll(".issue-card");
       allCards.forEach(card => {
        if(status === "all"){
            card.classList.remove("hidden");
        }else{card.classList.toggle("hidden", !card.classList.contains(`status-${status}`))};
       });
       const visibleCount = document.querySelectorAll(".issue-card:not(.hidden)").length;
       issuesCount.textContent = `${visibleCount} Issue${visibleCount !== 1 ? 's' : ''}`;
    });
});


searchBtn.addEventListener("click", () =>{
      const search = searchInput.value;
      const allCards = document.querySelectorAll(".issue-card");

      allCards.forEach(card => {
         const title = card.querySelector("h2").textContent;
         const description = card.querySelector(".issue-description").textContent;

         if(title.includes(search) || description.includes(search)){
           card.classList.remove("hidden");
         } else{
            card.classList.add("hidden");
         }
      });
      const visibleCount = document.querySelectorAll(".issue-card:not(.hidden)").length;
       issuesCount.textContent = `${visibleCount} Issue${visibleCount !== 1 ? 's' : ''}`;
     
});



const modalIcons = [
           '<i class="fa-solid fa-hand-peace"></i>',
           '<i class="fa-solid fa-podcast"></i>'
            ];

modalColor = [
             "text-red-700 bg-red-100 border-red-300",
             "text-amber-700 bg-yellow-100 border-yellow-300 "
        ];

statusModalColor = {
           open: "text-white bg-green-700 rounded-2xl p-1 w-20 text-center font-medium",
           closed: "text-white bg-purple-700 rounded-2xl p-1 w-20 text-center font-medium"
};

const openModal = (id) => {
  const issue = allIssues.find(i => i.id === id);
  if (!issue) return;

  const setText = (element, value) =>{
     element.textContent = value || "Data not found";
  };

     setText(modalTitle, issue.title);
     setText(modalStatus, issue.status);
     setText(modalAuthor, issue.author);
     setText(modalDate, issue.createdAt);
     setText(modalDescription, issue.description);
     setText(modalAuthorName, issue.assignee);
     setText(modalPriority, issue.priority);

  modalLabels.innerHTML = "";

   issue.labels.forEach((label, index) => {
    const span = document.createElement("span");
    
    modalStatus.className = statusModalColor[issue.status];
   
    const icon = modalIcons[index] || '<i class="fa-solid fa-podcast"></i>';

    const color = modalColor[index] || modalColor[0];

    span.className =
      `${color} font-medium p-1 border-2 text-center rounded-[12px]`;

    span.innerHTML = `${icon} ${label}`;

    modalLabels.appendChild(span);
  });

  issuesModal.showModal();
};