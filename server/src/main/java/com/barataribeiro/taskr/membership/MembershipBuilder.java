package com.barataribeiro.taskr.membership;

import com.barataribeiro.taskr.membership.dtos.MembershipDTO;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class MembershipBuilder {
    private final ModelMapper modelMapper;

    public MembershipDTO toMembershipDTO(Membership membership) {
        return modelMapper.map(membership, MembershipDTO.class);
    }
}
