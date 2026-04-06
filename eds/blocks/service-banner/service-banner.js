export default function decorate(block) {
  const wrapper = block.firstElementChild;
  wrapper.classList.add("wrapper");

  const banner = wrapper.firstElementChild;
  const content = wrapper.children[1];
  const img = banner.querySelector("picture");

  banner.innerHTML = "";
  banner.className = "banner";
  content.className = "content";

  banner.appendChild(img);
}
