using System;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController: ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration  _config;
        private readonly IMapper _mapper;

        public AuthController(IAuthRepository repo, IConfiguration config,
        IMapper mapper)
        {
            _repo   = repo;
            _config = config;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            userForRegisterDto.Username = userForRegisterDto.Username.ToLower();

            if (await _repo.UserExists(userForRegisterDto.Username))
            {
                return new BadRequestResult();
            }

            var userToCreate = _mapper.Map<User>(userForRegisterDto);

            var createdUser = await _repo.Register(userToCreate, userForRegisterDto.Password);

            var userToReturn = _mapper.Map<UserForDetailsDto>(createdUser);
            return CreatedAtRoute("GetUser", new {controller = "Users", id = createdUser.Id},
                userToReturn);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            var user = await _repo.Login(userForLoginDto.Username.ToLower(), userForLoginDto.Password);

            if (user == null)
            {
                return new UnauthorizedResult();
            }

            var claims = new[]
            {
                new Claim("userId", user.Id.ToString()),
                new Claim("username", user.Username),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JsonWebTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            var userRe = _mapper.Map<UserForListDto>(user);
            
            return Ok(new
            {
                token,
                userRe
            });

        }
    }
}