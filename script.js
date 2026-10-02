import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL="https://sfhlcynfnibclqckubtz.supabase.co";
const SUPABASE_KEY="sb_publishable_aJB3WsFBPKWMIfUNSmmUDA_3cU_b3Mc";
const supabase=createClient(SUPABASE_URL,SUPABASE_KEY);

// Paste your real payment-link URL here when you have one.
// A Yoco Link, SnapScan Payment Link, or PayFast checkout URL can be used.
const ONLINE_PAYMENT_URL="";

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
if(ticketType) ticketType.addEventListener("change",updateTotal);
if(quantity) quantity.addEventListener("change",updateTotal);
updateTotal();

function ticketNumber(){return "AHT-"+Math.floor(100000+Math.random()*900000)}

function showConfirmation(ticket,total,payment){
  confirmation.classList.remove("hidden");
  const paymentText=payment==="online" ? "Online payment selected" : "Cash payment selected";
  const onlineButton=(payment==="online" && ONLINE_PAYMENT_URL)
    ? `<a class="button" href="${ONLINE_PAYMENT_URL}" target="_blank" rel="noopener">PAY ONLINE NOW →</a>`
    : payment==="online"
      ? `<p class="payment-wait">Online payment link is being connected. Keep this ticket number and complete payment once the payment button is enabled.</p>`
      : `<p class="payment-wait">Please pay cash to the event organiser and keep this ticket number until your payment is confirmed.</p>`;
  confirmation.innerHTML=`
    <p class="eyebrow">REGISTRATION RECEIVED</p>
    <h3>YOUR TICKET NUMBER</h3>
    <div class="ticket-number">${ticket.ticket_number}</div>
    <p><strong>DO NOT LOSE THIS NUMBER.</strong> Keep it on your phone and bring it with you.</p>
    <p>${paymentText} · Total: <strong>R${total}</strong></p>
    ${onlineButton}
    <p class="notification-note">A confirmation notification can be sent to the phone/email you entered once the notification service is connected.</p>`;
}

form?.addEventListener("submit",async e=>{
  e.preventDefault();
  const data=new FormData(form);
  const requestedQuantity=Number(data.get("quantity"))||0;
  const type=data.get("ticket");
  const payment=data.get("payment");
  const isReentry=type==="Re-entry";
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
      const availability=await fetch(`${SUPABASE_URL}/rest/v1/rpc/tickets_remaining`,{
        method:"POST",
        headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY},
        body:"{}"
      });
      if(!availability.ok) throw new Error(await availability.text());
      const remaining=Number(await availability.json());
      if(requestedQuantity>remaining){message.textContent=`Only ${remaining} event ticket(s) remain.`;return;}
    }

    const save=await fetch(`${SUPABASE_URL}/rest/v1/tickets`,{
      method:"POST",
      headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY,"Prefer":"return=minimal"},
      body:JSON.stringify(ticket)
    });
    if(!save.ok) throw new Error(await save.text());

    const total=(prices[type]||0)*requestedQuantity;
    if ("Notification" in window && Notification.permission === "default") { try { await Notification.requestPermission(); } catch {} }
    if ("Notification" in window && Notification.permission === "granted") { new Notification("After Hours registration confirmed", { body: `Ticket ${ticket.ticket_number} — do not lose this number.` }); }
    message.textContent="Registration complete.";
    showConfirmation(ticket,total,payment);
    localStorage.setItem("afterHoursLastTicket",ticket.ticket_number);
    form.reset();
    updateTotal();
  }catch(error){
    console.error(error);
    message.textContent="Something went wrong. Please try again.";
  }
});
