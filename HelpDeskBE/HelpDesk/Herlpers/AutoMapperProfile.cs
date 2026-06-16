using AutoMapper;
using HelpDesk.Database.Entities;
using HelpDesk.Dtos.AgenciesDto;
using HelpDesk.Dtos.AlertConfigurationDto;
using HelpDesk.Dtos.AlertHistoryDto;
using HelpDesk.Dtos.AlertTypeDto;
using HelpDesk.Dtos.AreaDto;
using HelpDesk.Dtos.DeviceDto;
using HelpDesk.Dtos.ImpactDto;
using HelpDesk.Dtos.MaintenanceDto;
using HelpDesk.Dtos.MaintenanceHistoryDto;
using HelpDesk.Dtos.NotificationDto;
using HelpDesk.Dtos.NotificationHistoryDto;
using HelpDesk.Dtos.OrganizationsDto;
using HelpDesk.Dtos.PriorityDto;
using HelpDesk.Dtos.ResolutionDto;
using HelpDesk.Dtos.RolesDto;
using HelpDesk.Dtos.SoftwareSystemDto;
using HelpDesk.Dtos.SolutionStateDto;
using HelpDesk.Dtos.TicketDto;
using HelpDesk.Dtos.TicketHistory;
using HelpDesk.Dtos.TypeDevicesDto;
using HelpDesk.Dtos.TypeErrorDto;
using HelpDesk.Dtos.TypeMaintenanceDto;
using HelpDesk.Dtos.UsersDto;

namespace HelpDesk.Herlpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            MapsForOrganization();
            MapsForRol();
            MapsForUser();
            MapsForAgency();
            MapsForArea();
            MapsForTypeError();
            MapsForImpact();
            MapsForSoftwareSystem();
            MapsForPriority();
            MapsForTicket();
            MapsForSolutionState();
            MapsForResolution();
            MapsForTicketHistory();
            MapsForTypeMaintenance();
            MapsForTypeDevices();
            MapsForDevice();
            MapsForMaintenance();
            MapsForMaintenanceHistory();
            MapsForAlertType();
            MapsForNotification();
            MapsForAlertConfiguration();
            MapsForNotificationHistory();
            MapsForAlerHistory();

        }

        private void MapsForOrganization()
        {
            CreateMap<OrganizationEntity, OrganizationDto>()
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => src.CreatedDate));
            CreateMap<CreateOrganizationDto, OrganizationEntity>();
            CreateMap<UpdateOrganizationDto, OrganizationEntity>();
        }

        private void MapsForUser()
        {
            CreateMap<UserEntity, UserResponseDto>()
                .ForMember(dest => dest.IdRol, opt => opt.MapFrom(src => src.IdRol))
                .ForMember(dest => dest.IdAgency, opt => opt.MapFrom(src => src.IdAgency))
                .ForMember(dest => dest.IdArea, opt => opt.MapFrom(src => src.IdArea))
                .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.Roles != null ? src.Roles.Name : string.Empty))
                .ForMember(dest => dest.AgencyName, opt => opt.MapFrom(src => src.Agency != null ? src.Agency.Name : string.Empty))
                .ForMember(dest => dest.AreaName, opt => opt.MapFrom(src => src.Area != null ? src.Area.NameArea : string.Empty));
            CreateMap<UserRegisterDto, UserEntity>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.PasswordSalt, opt => opt.Ignore());
            CreateMap<UpdateUserDto, UserEntity>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.PasswordSalt, opt => opt.Ignore())
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) =>
                    srcMember != null && !(srcMember is string str && string.IsNullOrWhiteSpace(str))
                ));
        }

        private void MapsForRol()
        {
            CreateMap<RolEntity, RolDto>();
            CreateMap<CreateRolDto, RolEntity>();
            CreateMap<UpdateRolDto, RolEntity>();
        }

        private void MapsForAgency()
        {
   
            CreateMap<AgencyEntity, AgencyDto>()
                .ForMember(dest => dest.OrganizationName,
                           opt => opt.MapFrom(src => src.Organizations.Name))
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => src.CreatedDate));
            CreateMap<CreateAgencyDto, AgencyEntity>();
            CreateMap<UpdateAgencyDto, AgencyEntity>();
        }

        private void MapsForArea()
        {
            CreateMap<AreaEntity, AreaDto>()
                .ForMember(dest => dest.AgencyName,
                           opt => opt.MapFrom(src => src.Agencies.Name))
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => src.CreatedDate));

            CreateMap<CreateAreaDto, AreaEntity>();
            CreateMap<UpdateAreaDto, AreaEntity>();
        }

        private void MapsForTypeError()
        {
            CreateMap<TypeErrorEntity, TypeErrorDto>();
            CreateMap<CreateTypeErrorDto, TypeErrorEntity>();
            CreateMap<UpdateTypeErrorDto, TypeErrorEntity>();
        }

        private void MapsForImpact()
        {
            CreateMap<ImpactEntity, ImpactDto>();
            CreateMap<CreateImpactDto, ImpactEntity>();
            CreateMap<UpdateImpactDto, ImpactEntity>();
        }

        private void MapsForSoftwareSystem()
        {
            CreateMap<SoftwareSystemEntity, SoftwareSystemDto>();
            CreateMap<CreateSoftwareSystemDto, SoftwareSystemEntity>();
            CreateMap<UpdateSoftwareSystemDto, SoftwareSystemEntity>();
        }

        private void MapsForPriority()
        {
            CreateMap<PriorityEntity, PriorityDto>();
            CreateMap<CreatePriorityDto, PriorityEntity>();
            CreateMap<UpdatePriorityDto, PriorityEntity>();
        }

        private void MapsForTicket()
        {
            CreateMap<TicketEntity, TicketDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName))
                .ForMember(dest => dest.TypeErrorName, opt => opt.MapFrom(src => src.TypeError.Name))
                .ForMember(dest => dest.AreaName, opt => opt.MapFrom(src => src.Area.NameArea))
                .ForMember(dest => dest.SoftwareSystemName, opt => opt.MapFrom(src => src.SoftwareSystem.Name))
                .ForMember(dest => dest.ImpactName, opt => opt.MapFrom(src => src.Impact.Name))
                .ForMember(dest => dest.PriorityName, opt => opt.MapFrom(src => src.Priority.Name));
            CreateMap<CreateTicketDto, TicketEntity>();
            CreateMap<UpdateTicketDto, TicketEntity>();

        }

        private void MapsForSolutionState()
        {
            CreateMap<SolutionStatusEntity, SolutionStateDto>();
            CreateMap<CreateSolutionStateDto, SolutionStatusEntity>();
            CreateMap<UpdateSolutionStateDto, SolutionStatusEntity>();
        }

        private void MapsForResolution()
        {
            CreateMap<ResolutionEntity, ResolutionDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName))
                .ForMember(dest => dest.SolutionStatusName, opt => opt.MapFrom(src => src.SolutionStatus.Name))
                .ForMember(dest => dest.DeviceName, opt => opt.MapFrom(src => src.Device.BrandName))
                .ForMember(dest => dest.PriorityName, opt => opt.MapFrom(src => src.Priority.Name))
                .ForMember(dest => dest.TicketDescription, opt => opt.MapFrom(src => src.Ticket.Description))
                .ForMember(dest => dest.TicketCreatorName, opt => opt.MapFrom(src => src.Ticket.User.UserName))
                .ForMember(dest => dest.TicketAreaName, opt => opt.MapFrom(src => src.Ticket.Area.NameArea));

            CreateMap<CreateResolutionDto, ResolutionEntity>();
            CreateMap<UpdateResolutionDto, ResolutionEntity>();
        }

        private void MapsForTicketHistory()
        {
            CreateMap<TicketHistoryEntity, TicketHistoryDto>()
                .ForMember(dest => dest.TicketDescription, opt => opt.MapFrom(src => src.Ticket.Description))
                .ForMember(dest => dest.SoftwareSystemName, opt => opt.MapFrom(src => src.Ticket.SoftwareSystem.Name))
                .ForMember(dest => dest.ActionTaken, opt => opt.MapFrom(src => src.Resolution.ActionTaken))
                .ForMember(dest => dest.RootCause, opt => opt.MapFrom(src => src.Resolution.RootCause))
                .ForMember(dest => dest.SolutionTime, opt => opt.MapFrom(src => src.Resolution.SolutionTime))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName));

            CreateMap<CreateTicketDto, TicketEntity>();
        }

        private void MapsForTypeMaintenance()
        {
            CreateMap<TypeMaintenanceEntity, TypeMaintenanceDto>();
            CreateMap<CreateTypeMaintenanceDto, TypeMaintenanceEntity>();
            CreateMap<UpdateTypeMaintenanceDto, TypeMaintenanceEntity>();
        }

        private void MapsForTypeDevices()
        {
            CreateMap<TypeDeviceEntity, TypeDevicesDto>();
            CreateMap<CreateTypeDevicesDto, TypeDeviceEntity>();
            CreateMap<UpdateTypeDevicesDto, TypeDeviceEntity>();
        }

        private void MapsForDevice()
        {
            CreateMap<DeviceEntity, DeviceDto>()
                .ForMember(dest => dest.DeviceTypeName, opt => opt.MapFrom(src => src.TypeDevices.Name))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Users.UserName))
                .ForMember(dest => dest.AreaName, opt => opt.MapFrom(src => src.Areas.NameArea));
            CreateMap<CreateDeviceDto, DeviceEntity>();
            CreateMap<UpdateDeviceDto, DeviceEntity>();
        }

        private void MapsForMaintenance()
        {
            CreateMap<MaintenanceEntity, MaintenanceDto>()
                .ForMember(dest => dest.MaintenanceTypeName, opt => opt.MapFrom(src => src.TypeMaintenance.Name))
                .ForMember(dest => dest.AreaName, opt => opt.MapFrom(src => src.Area.NameArea))
                .ForMember(dest => dest.DeviceCode, opt => opt.MapFrom(src => src.Device.Code))
                .ForMember(dest => dest.DeviceBrand, opt => opt.MapFrom(src => src.Device.BrandName));
            CreateMap<CreateMaintenanceDto, MaintenanceEntity>();
            CreateMap<UpdateMaintenanceDto, MaintenanceEntity>();
        }

        private void MapsForMaintenanceHistory()
        {
            CreateMap<MaintenanceHistoryEntity, MaintenanceHistoryDto>()
                .ForMember(dest => dest.MaintenanceDetails, opt => opt.MapFrom(src => src.Maintenances.Details))
                .ForMember(dest => dest.DeviceCode, opt => opt.MapFrom(src => src.Devices.Code))
                .ForMember(dest => dest.DeviceBrand, opt => opt.MapFrom(src => src.Devices.BrandName))
                .ForMember(dest => dest.DeviceType, opt => opt.MapFrom(src => src.DevicesType.Name))
                .ForMember(dest => dest.TechnicalName, opt => opt.MapFrom(src => src.Users.UserName))
                .ForMember(dest => dest.TechnicalEmail, opt => opt.MapFrom(src => src.Users.Email));
            CreateMap<CreateMaintenanceHistoryDto, MaintenanceHistoryEntity>();
            CreateMap<UpdateMaintenanceHistoryDto, MaintenanceHistoryEntity>();
        }

        private void MapsForAlertType()
        {
            CreateMap<AlertTypeEntity, AlertTypeDto>();
            CreateMap<CreateAlertTypeDto, AlertTypeEntity>();
            CreateMap<UpdateAlertTypeDto, AlertTypeEntity>();
        }

        private void MapsForNotification()
        {
            CreateMap<NotificationEntity, NotificationDto>()
              .ForMember(dest => dest.UserEmail, opt => opt.MapFrom(src => src.Users.Email))
              .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Users.UserName))
              .ForMember(dest => dest.AlertTypeName, opt => opt.MapFrom(src => src.AlertTypes.Name));
            CreateMap<CreateNotificationDto, NotificationEntity>();
            CreateMap<UpdateNotificationDto, NotificationEntity>();
        }

        private void MapsForAlertConfiguration()
        {
            CreateMap<AlertConfigurationEntity, AlertConfigurationDto>()
                .ForMember(dest => dest.AreaName, opt => opt.MapFrom(src => src.Areas != null ? src.Areas.NameArea : "Global / No Aplica"))
                .ForMember(dest => dest.AgencyName, opt => opt.MapFrom(src => src.Agencys != null ? src.Agencys.Name : "Global / No Aplica"));
            CreateMap<CreateAlertConfigurationDto, AlertConfigurationEntity>();
            CreateMap<UpdateAlertConfigurationDto, AlertConfigurationEntity>();
        }

        private void MapsForNotificationHistory()
        {
            CreateMap<NotificationHistoryEntity, NotificationHistoryDto>()
                // Mapeo desde el segundo nivel de relación (Historial -> Notification -> User)
                .ForMember(dest => dest.IdUser, opt => opt.MapFrom(src => src.Notifications.IdUser))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Notifications.Users.UserName))
                .ForMember(dest => dest.UserEmail, opt => opt.MapFrom(src => src.Notifications.Users.Email))

                // Mapeo desde el primer nivel (Historial -> Notification)
                .ForMember(dest => dest.IdReference, opt => opt.MapFrom(src => src.Notifications.IdReference))
                .ForMember(dest => dest.IsRead, opt => opt.MapFrom(src => src.Notifications.IsRead))
                .ForMember(dest => dest.TextMessage, opt => opt.MapFrom(src => src.Notifications.TextMessage));
            CreateMap<CreateNotificationDto, NotificationHistoryEntity>();
        }

        private void MapsForAlerHistory()
        {
            CreateMap<AlertHistoryEntity, AlertHistoryDto>()
                .ForMember(dest => dest.AlertTitle, opt => opt.MapFrom(src => src.AlertConfiguration.Title))
                .ForMember(dest => dest.AlertSubject, opt => opt.MapFrom(src => src.AlertConfiguration.Subject))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName))
                .ForMember(dest => dest.UserEmail, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.ExecutionDate, opt => opt.MapFrom(src => src.ActionDate));
            CreateMap<CreateAlerHistoryDto, AlertHistoryEntity>();
        }
   
    }
}

