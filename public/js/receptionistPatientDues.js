async function logout() {
    localStorage.clear();
    let result = await fetch("http://localhost:4200/logout", {
      method: "DELETE",
    });
    window.location.replace("http://localhost:4200");
  }
  
  function settingName() {
    let setName = document.getElementById("setName");
    let name = localStorage.getItem("NAME");
    setName.innerText = `Welcome ${name}`;
    //console.log(setName);
  }
  
  settingName();
  let appointment;

  async function clearDue1(ref){
    let flag = confirm('Are You Sure About Clearing This Due?')
    if(flag){
      let info = {
        BILL_ID:ref.parentNode.childNodes[1].innerText,
      };
      let result = await fetch("http://localhost:4200/receptionist/doClearDue1", {
        method: "POST",
        body: JSON.stringify(info),
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      if(result.success){
        document.getElementById('nid').value = localStorage.getItem('PID');
        search();
      }
    }
  }


  async function clearDue2(ref){
    let flag = confirm('Are You Sure About Clearing This Due?')
    if(flag){
      let info = {
        BILL_ID:ref.parentNode.childNodes[1].innerText,
      };
      let result = await fetch("http://localhost:4200/receptionist/doClearDue2", {
        method: "POST",
        body: JSON.stringify(info),
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      if(result.success){
        document.getElementById('nid').value = localStorage.getItem('PID');
        search();
      }
    }
  }

  function test(result) {
    let div1 = document.getElementById("insert");
    div1.innerHTML="";
    for(let i=0; i<result.result.length; i++){
      div1.innerHTML += `
          <div class="card text-white bg-success mb-3" style="max-width: 60rem;">
          <div class="card-header">
            <div class="row">
                <div class="col-sm-3">
                <p style="color:white"><i>Bill ID:</i> ${result.result[i].BILL_ID}</p>
                </div>
                <div class="col-sm-3">
                <p style="color:white"><i>Bill Type:</i> ${result.result[i].BILL_TYPE}</p>
                </div>
                <div class="col-sm-3">
                <p style="color:white"><i>Bill For:</i> ${result.result[i].BILL_TYPE_NAME}<br>
                <i>Amount:</i> ${result.result[i].DUE_BILL_AMOUNT}</p>
                </div>
                <div class="col-sm-3">
                <div class="btn-group" role="group" aria-label="Basic example">
                  <p hidden>${result.result[i].BILL_ID}</p>
                  <button type="button" onclick="clearDue1(this)"class="btn btn-dark">Clear Due</button>
                </div>
                </div>
                
            </div>
          </div>
        </div>
      `;
    }

    for(let i=0; i<result.result2.length; i++){
      div1.innerHTML += `
          <div class="card text-white bg-success mb-3" style="max-width: 60rem;">
          <div class="card-header">
            <div class="row">
                <div class="col-sm-3">
                <p style="color:white"><i>Bill ID:</i> ${result.result2[i].BILL_ID}</p>
                </div>
                <div class="col-sm-3">
                <p style="color:white"><i>Bill FOR:</i> ${result.result2[i].BED_NO}</p>
                </div>
                <div class="col-sm-3">
                <p style="color:white"><i>Ward: </i> ${result.result2[i].WARD_NAME}<br>
                <i>Amount:</i> ${result.result2[i].DUE_BILL_AMOUNT}</p>
                </div>
                <div class="col-sm-3">
                <div class="btn-group" role="group" aria-label="Basic example">
                  <p hidden>${result.result2[i].BILL_ID}</p>
                  <button type="button" onclick="clearDue2(this)"class="btn btn-dark">Clear Due</button>
                </div>
                </div>
                
            </div>
          </div>
        </div>
      `;
    }
  
  }



  async function search(){
    let nid = document.getElementById('nid').value;
    if(nid === ""){
        document.getElementById('error').style.display = "block";
        let div1 = document.getElementById("insert");
        div1.innerHTML="";
    }
    else{
        document.getElementById('error').style.display = "none";
        localStorage.setItem('PID',nid);
        let info = {
            PID:nid
          };
          appointment = await fetch("http://localhost:4200/receptionist/getPatientDues", {
              method: "POST",
              body: JSON.stringify(info),
              headers: {
                "Content-Type": "application/json",
              },
            });
            appointment = await appointment.json();
            console.log(appointment.result);
            if(appointment.result.length==0 && appointment.result2.length==0){
              let div1 = document.getElementById("insert");
              div1.innerHTML="";
              div1.innerHTML += `<h1 style="color:red"> No Dues Found For this patient.. </h1>`
            }
            else{
              test(appointment);
            }
    }
}