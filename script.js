import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL="https://sfhlcynfnibclqckubtz.supabase.co";
const SUPABASE_KEY="sb_publishable_aJB3WsFBPKWMIfUNSmmUDA_3cU_b3Mc";
const supabase=createClient(SUPABASE_URL,SUPABASE_KEY);

const PAYMENT_LINKS={
  "Ridgefield Student":"https://payrequest.co.za/pay/wQPC3kM9ZN",
  "Outside Student":"https://payrequest.co.za/pay/RQebJGWHPT",
  "Re-entry":"https://payrequest.co.za/pay/rN9gRD4GBU"
};
const prices={"Ridgefield Student":100,"Outside Student":80,"Re-entry":50};
const form=document.getElementById("ticketForm");
const message=document.getElementById("formMessage");
const confirmation=document.getElementById("ticketConfirmation");
const ticketType=document.getElementById("ticketType");
const quantity=document.getElementById("quantity");
const totalPrice=document.getElementById("totalPrice");

function updateTotal(){
  const price=prices[ticketType?.value]||0;
  totalPrice.textContent="R"+(price*(Number(quantity?.value)||0));
}
function enforceOnlineQuantity(){
  const online=document.querySelector('input[name="payment"]:checked')?.value==="online";
  const reentry=ticketType?.value==="Re-entry";
  if(online||reentry){ quantity.value="1"; quantity.disabled=true; }
  else { quantity.disabled=false; }
  updateTotal();
}
if(ticketType) ticketType.addEventListener("change",()=>{enforceOnlineQuantity();});
if(quantity) quantity.addEventListener("change",updateTotal);
document.querySelectorAll('input[name="payment"]').forEach(r=>r.addEventListener("change",enforceOnlineQuantity));
updateTotal();

function ticketNumber(){return "AHT-"+Math.floor(100000+Math.random()*900000)}

function showConfirmation(ticket,total,payment){
  confirmation.classList.remove("hidden");
  const type=ticket.ticket_type;
  const link=PAYMENT_LINKS[type];
  const paymentBlock=payment==="online"
    ? `<p class="payment-wait"><strong>ONLINE EFT:</strong> Click the button below. Pay the exact amount shown on the PayRequest page, then keep your proof of payment.</p><a class="button" href="${link}" target="_blank" rel="noopener">PAY R${total} ONLINE EFT →</a><p class="payment-wait">Your PayRequest page contains the payment instructions. Your After Hours ticket number remains <strong>${ticket.ticket_number}</strong>.</p>`
    : `<p class="payment-wait"><strong>CASH:</strong> Pay the event organiser in cash and keep your ticket number until your payment is confirmed.</p>`;
  confirmation.innerHTML=`
    <p class="eyebrow">REGISTRATION RECEIVED</p>
    <h3>YOUR TICKET NUMBER</h3>
    <div class="ticket-number">${ticket.ticket_number}</div>
    <p><strong>DO NOT LOSE THIS NUMBER.</strong> Save it on your phone and keep it safe.</p>
    <p>Total: <strong>R${total}</strong> · ${type}</p>
    ${paymentBlock}`;
}

form?.addEventListener("submit",async e=>{
  e.preventDefault();
  const data=new FormData(form);
  const requestedQuantity=Number(data.get("quantity"))||1;
  const type=data.get("ticket");
  const payment=data.get("payment");
  const isReentry=type==="Re-entry";
  if(payment==="online" && requestedQuantity!==1){message.textContent="Online EFT is one ticket per payment. Please register one ticket at a time.";return;}
  const ticket={
    ticket_number:ticketNumber(),
    full_name:data.get("name"),
    age:Number(data.get("age")),
    school:data.get("school"),
    phone:data.get("phone"),
    email:data.get("email"),
    ticket_type:type,
    quantity:requestedQuantity,
    payment_method:payment,
    payment_status:payment==="online"?"awaiting_payment":"awaiting_cash"
  };
  message.textContent="Checking ticket availability...";
  confirmation.classList.add("hidden");
  try{
    if(!isReentry){
      const availability=await fetch(`${SUPABASE_URL}/rest/v1/rpc/tickets_remaining`,{method:"POST",headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY},body:"{}"});
      if(!availability.ok) throw new Error(await availability.text());
      const remaining=Number(await availability.json());
      if(requestedQuantity>remaining){message.textContent=`Only ${remaining} event ticket(s) remain.`;return;}
    }
    const save=await fetch(`${SUPABASE_URL}/rest/v1/tickets`,{method:"POST",headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY,"Prefer":"return=minimal"},body:JSON.stringify(ticket)});
    if(!save.ok) throw new Error(await save.text());
    const total=(prices[type]||0)*requestedQuantity;
    if("Notification" in window && Notification.permission==="default"){try{await Notification.requestPermission();}catch{}}
    if("Notification" in window && Notification.permission==="granted"){new Notification("After Hours registration confirmed",{body:`Ticket ${ticket.ticket_number} — do not lose this number.`});}
    message.textContent="Registration complete.";
    showConfirmation(ticket,total,payment);
    localStorage.setItem("afterHoursLastTicket",ticket.ticket_number);
    form.reset();
    quantity.disabled=false;
    updateTotal();
  }catch(error){
    console.error(error);
    message.textContent="Something went wrong. Please try again.";
  }
});
