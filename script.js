import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
const SUPABASE_URL="https://sfhlcynfnibclqckubtz.supabase.co";
const SUPABASE_KEY="sb_publishable_aJB3WsFBPKWMIfUNSmmUDA_3cU_b3Mc";
const supabase=createClient(SUPABASE_URL,SUPABASE_KEY);
const form=document.getElementById("ticketForm"),message=document.getElementById("formMessage"),ticketType=document.getElementById("ticketType"),quantity=document.getElementById("quantity"),totalPrice=document.getElementById("totalPrice");
function updateTotal(){const price=ticketType.value==="Ridgefield Student"?100:ticketType.value==="Outside Student"?80:0;totalPrice.textContent="R"+price*(Number(quantity.value)||0)}
ticketType.addEventListener("change",updateTotal);quantity.addEventListener("change",updateTotal);updateTotal();
function ticketNumber(){return "AHT-"+Math.floor(100000+Math.random()*900000)}
form.addEventListener("submit",async e=>{e.preventDefault();const data=new FormData(form),requestedQuantity=Number(data.get("quantity"))||0;message.textContent="Checking ticket availability...";
try{const availability=await fetch(`${SUPABASE_URL}/rest/v1/rpc/tickets_remaining`,{method:"POST",headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY},body:"{}"});if(!availability.ok)throw new Error(await availability.text());const remaining=Number(await availability.json());if(requestedQuantity>remaining){message.textContent=`Only ${remaining} ticket(s) remain.`;return}
const ticket={ticket_number:ticketNumber(),full_name:data.get("name"),age:Number(data.get("age")),school:data.get("school"),phone:data.get("phone"),email:data.get("email"),ticket_type:data.get("ticket"),quantity:requestedQuantity,payment_method:data.get("payment"),payment_status:data.get("payment")==="card"?"awaiting_payment":"awaiting_cash"};
const save=await fetch(`${SUPABASE_URL}/rest/v1/tickets`,{method:"POST",headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY,"Prefer":"return=minimal"},body:JSON.stringify(ticket)});if(!save.ok)throw new Error(await save.text());
const total=(ticket.ticket_type==="Ridgefield Student"?100:80)*requestedQuantity;message.innerHTML=`<strong>Ticket details received.</strong><br>Your reference: <strong>${ticket.ticket_number}</strong><br>Total: <strong>R${total}</strong><br>Payment: <strong>${ticket.payment_status}</strong>`;form.reset();updateTotal()
}catch(error){console.error(error);message.textContent="Something went wrong. Please try again."}});
