package com.barataribeiro.taskr.activity;

import com.barataribeiro.taskr.activity.dtos.ActivityDTO;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ActivityBuilder {
    private final ModelMapper modelMapper;

    public ActivityDTO toActivityDTO(Activity activity) {
        return modelMapper.map(activity, ActivityDTO.class);
    }
}
